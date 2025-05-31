"use client"

import type React from "react"

import { useState, useRef } from "react"
import { ChevronRight, ChevronLeft, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { geoLocation } from "@/api/geo-location"

type SelectionPath = {
    country?: string
    division?: string
    district?: string
    upazila?: string
}

type Level = "country" | "division" | "district" | "upazila"

export default function CascadingSelect() {
    const [currentLevel, setCurrentLevel] = useState<Level>("country")
    const [selectionPath, setSelectionPath] = useState<SelectionPath>({})
    const [isAnimating, setIsAnimating] = useState(false)
    const [finalSelection, setFinalSelection] = useState<string>("")
    const [isDropdownOpen, setIsDropdownOpen] = useState(true)
    const containerRef = useRef<HTMLDivElement>(null)

    const data = geoLocation[0]

    // Get current options based on level and selection path
    const getCurrentOptions = () => {
        switch (currentLevel) {
            case "country":
                return [{ name: data.country, value: data.country }]
            case "division":
                return data.divisions.map((div) => ({ name: div.name, value: div.name }))
            case "district":
                const selectedDivision = data.divisions.find((div) => div.name === selectionPath.division)
                return selectedDivision?.districts.map((dist) => ({ name: dist.name, value: dist.name })) || []
            case "upazila":
                const division = data.divisions.find((div) => div.name === selectionPath.division)
                const selectedDistrict = division?.districts.find((dist) => dist.name === selectionPath.district)
                return selectedDistrict?.upazilas.map((upazila) => ({ name: upazila, value: upazila })) || []
            default:
                return []
        }
    }

    // Handle selection at current level
    const handleSelection = async (value: string) => {
        if (isAnimating) return

        setIsAnimating(true)

        const newPath = { ...selectionPath }

        switch (currentLevel) {
            case "country":
                newPath.country = value
                setSelectionPath(newPath)
                await animateToLevel("division")
                break
            case "division":
                newPath.division = value
                setSelectionPath(newPath)
                await animateToLevel("district")
                break
            case "district":
                newPath.district = value
                setSelectionPath(newPath)
                await animateToLevel("upazila")
                break
            case "upazila":
                newPath.upazila = value
                setSelectionPath(newPath)
                // Final selection - automatically finalize without confirmation
                const fullPath = `${newPath.country} > ${newPath.division} > ${newPath.district} > ${newPath.upazila}`
                setFinalSelection(fullPath)
                // Automatically close the dropdown by setting a closed state
                setIsDropdownOpen(false)
                break
        }

        setIsAnimating(false)
    }

    // Animate to a specific level
    const animateToLevel = async (level: Level) => {
        setCurrentLevel(level)
        // Small delay for animation
        await new Promise((resolve) => setTimeout(resolve, 300))
    }

    // Reset to beginning
    const reset = async () => {
        if (isAnimating) return

        setIsAnimating(true)
        setSelectionPath({})
        setFinalSelection("")
        setIsDropdownOpen(true)
        await animateToLevel("country")
        setIsAnimating(false)
    }

    // Keyboard navigation
    const handleKeyDown = (event: React.KeyboardEvent, value: string) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            handleSelection(value)
        }
    }

    const currentOptions = getCurrentOptions()
    const levelTitles = {
        country: "Select Country",
        division: "Select Division",
        district: "Select District",
        upazila: "Select Upazila",
    }

    return (
        <div className="w-full">
            {/* Final Selection Display - Select Box Style */}
            {finalSelection && !isDropdownOpen ? (
                <div className="relative space-y-3">
                    <h3 className="text-sm font-semibold">Select Location</h3>
                    <div className="w-full p-3 border rounded-lg bg-background flex items-center justify-between cursor-pointer hover:bg-muted transition-colors">
                        <span className="text-sm">{finalSelection}</span>
                        <button
                            onClick={reset}
                            className="ml-2 p-1 hover:bg-muted-foreground/20 rounded-full transition-colors"
                            aria-label="Clear selection"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ) : (
                // The dropdown content
                <div>
                    <div
                        ref={containerRef}
                        className={`transition-transform duration-300 ease-in-out  ${isAnimating ? "opacity-75" : "opacity-100"}`}
                    >
                        <div className="space-y-3 relative">
                            <div className="flex items-center gap-2">

                                <h3 className="text-sm font-semibold">Select Location</h3>


                            </div>

                            {currentOptions.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground ">No options available</div>
                            ) : (
                                <div className="select-dropdown-wrapper absolute left-0 right-0 top-5 max-h-64  bg-slate-100 overflow-y-auto">

                                    {currentLevel !== "country" && (
                                        <div className="selec-dropdown-top flex items-center justify-between mb-2">
                                            <span
                                                onClick={() => {
                                                    const levels: Level[] = ["country", "division", "district", "upazila"]
                                                    const currentIndex = levels.indexOf(currentLevel)
                                                    if (currentIndex > 0) {
                                                        const previousLevel = levels[currentIndex - 1]
                                                        setCurrentLevel(previousLevel)
                                                    }
                                                }}
                                                className="flex items-center gap-1 cursor-pointer"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                                Back
                                            </span>
                                            <span className="text-sm font-semibold ml-auto">{levelTitles[currentLevel]}</span>
                                        </div>
                                    )}
                                    <div className="grid gap-2 ">
                                        {currentOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => handleSelection(option.value)}
                                                onKeyDown={(e) => handleKeyDown(e, option.value)}
                                                disabled={isAnimating}
                                                className="w-full p-3 text-left border rounded-lg hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span>{option.name}</span>
                                                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}