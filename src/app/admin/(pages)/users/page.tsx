"use client"
import type { SVGProps } from "react";
import type { Selection, ChipProps, SortDescriptor } from "@heroui/react";
import React from "react";
import {
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, DropdownTrigger,
    Dropdown, DropdownMenu, DropdownItem, Chip, User, Pagination,
} from "@heroui/react";
import { Plus, EllipsisVertical, Search, ChevronDown } from "lucide-react";
import { api } from "@/lib/api";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
    size?: number;
};

export function capitalize(s: string) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}


export const columns = [
    { name: "ID", uid: "id", sortable: false },
    { name: "STEP", uid: "step", sortable: false },
    { name: "USER ID", uid: "userId", sortable: false },
    { name: "COMPLETED STEPS", uid: "completedSteps", sortable: false },
    { name: "PARTNER AGE MIN", uid: "partnerAgeMin", sortable: false },
    { name: "PARTNER AGE MAX", uid: "partnerAgeMax", sortable: false },
    { name: "SAME AS PERMANENT", uid: "sameAsPermanent", sortable: false },
    { name: "RELIGION", uid: "religion", sortable: false },
    { name: "BIODATA TYPE", uid: "biodataType", sortable: false },
    { name: "MARITAL STATUS", uid: "maritalStatus", sortable: true },
    { name: "DATE OF BIRTH", uid: "dateOfBirth", sortable: false },
    { name: "AGE", uid: "age", sortable: false },
    { name: "HEIGHT", uid: "height", sortable: false },
    { name: "WEIGHT", uid: "weight", sortable: false },
    { name: "COMPLEXION", uid: "complexion", sortable: false },
    { name: "PROFESSION", uid: "profession", sortable: false },
    { name: "BLOOD GROUP", uid: "bloodGroup", sortable: false },
    { name: "PERMANENT COUNTRY", uid: "permanentCountry", sortable: false },
    { name: "PERMANENT DIVISION", uid: "permanentDivision", sortable: false },
    { name: "PERMANENT ZILLA", uid: "permanentZilla", sortable: false },
    { name: "PERMANENT UPAZILLA", uid: "permanentUpazilla", sortable: false },
    { name: "PERMANENT AREA", uid: "permanentArea", sortable: false },
    { name: "PRESENT COUNTRY", uid: "presentCountry", sortable: false },
    { name: "PRESENT DIVISION", uid: "presentDivision", sortable: false },
    { name: "PRESENT ZILLA", uid: "presentZilla", sortable: false },
    { name: "PRESENT UPAZILLA", uid: "presentUpazilla", sortable: false },
    { name: "PRESENT AREA", uid: "presentArea", sortable: false },
    { name: "HEALTH ISSUES", uid: "healthIssues", sortable: false },
    { name: "EDUCATION MEDIUM", uid: "educationMedium", sortable: false },
    { name: "HIGHEST EDUCATION", uid: "highestEducation", sortable: false },
    { name: "INSTITUTE NAME", uid: "instituteName", sortable: false },
    { name: "SUBJECT", uid: "subject", sortable: false },
    { name: "PASSING YEAR", uid: "passingYear", sortable: false },
    { name: "RESULT", uid: "result", sortable: false },
    { name: "ECONOMIC CONDITION", uid: "economicCondition", sortable: false },
    { name: "FATHER NAME", uid: "fatherName", sortable: false },
    { name: "FATHER PROFESSION", uid: "fatherProfession", sortable: false },
    { name: "FATHER ALIVE", uid: "fatherAlive", sortable: false },
    { name: "MOTHER NAME", uid: "motherName", sortable: false },
    { name: "MOTHER PROFESSION", uid: "motherProfession", sortable: false },
    { name: "MOTHER ALIVE", uid: "motherAlive", sortable: false },
    { name: "BROTHERS COUNT", uid: "brothersCount", sortable: false },
    { name: "SISTERS COUNT", uid: "sistersCount", sortable: false },
    { name: "FAMILY DETAILS", uid: "familyDetails", sortable: false },
    { name: "PARTNER COMPLEXION", uid: "partnerComplexion", sortable: false },
    { name: "PARTNER HEIGHT", uid: "partnerHeight", sortable: false },
    { name: "PARTNER EDUCATION", uid: "partnerEducation", sortable: false },
    { name: "PARTNER PROFESSION", uid: "partnerProfession", sortable: false },
    { name: "PARTNER LOCATION", uid: "partnerLocation", sortable: false },
    { name: "PARTNER DETAILS", uid: "partnerDetails", sortable: false },
    { name: "FULL NAME", uid: "fullName", sortable: false },
    { name: "PROFILE PICTURE", uid: "profilePicture", sortable: false },
    { name: "EMAIL", uid: "email", sortable: false },
    { name: "GUARDIAN MOBILE", uid: "guardianMobile", sortable: false },
    { name: "OWN MOBILE", uid: "ownMobile", sortable: false },
    { name: "STATUS", uid: "status", sortable: false },
    { name: "ACTIONS", uid: "actions", sortable: false },
];

export const statusOptions = [
    { name: "Single", uid: "single" },
    { name: "Married", uid: "married" },
    { name: "Divorced", uid: "divorced" },
    { name: "Widowed", uid: "widowed" },
];

interface Biodata {
    id: number;
    step: number;
    userId: number | null;
    completedSteps: number | null;
    partnerAgeMin: number;
    partnerAgeMax: number;
    sameAsPermanent: boolean;
    religion: string;
    biodataType: string;
    maritalStatus: string;
    dateOfBirth: string;
    age: number;
    height: string;
    weight: number;
    complexion: string;
    profession: string;
    bloodGroup: string;
    permanentCountry: string;
    permanentDivision: string;
    permanentZilla: string;
    permanentUpazilla: string;
    permanentArea: string;
    presentCountry: string;
    presentDivision: string;
    presentZilla: string;
    presentUpazilla: string;
    presentArea: string;
    healthIssues: string;
    educationMedium: string;
    highestEducation: string;
    instituteName: string;
    subject: string;
    passingYear: number;
    result: string;
    economicCondition: string;
    fatherName: string;
    fatherProfession: string;
    fatherAlive: string;
    motherName: string;
    motherProfession: string;
    motherAlive: string;
    brothersCount: number;
    sistersCount: number;
    familyDetails: string;
    partnerComplexion: string;
    partnerHeight: string;
    partnerEducation: string;
    partnerProfession: string;
    partnerLocation: string;
    partnerDetails: string;
    fullName: string;
    profilePicture: string | null;
    email: string;
    guardianMobile: string;
    ownMobile: string;
    status: string | null;
}

const statusColorMap: Record<string, ChipProps["color"]> = {
    single: "primary",
    married: "success",
    divorced: "warning",
    widowed: "danger",
};



export default function Users() {
    const [biodatas, setBiodatas] = React.useState<Biodata[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
    const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
        column: "maritalStatus",
        direction: "ascending",
    });
    const [page, setPage] = React.useState(1);

    // Fetch biodatas from API
    React.useEffect(() => {
        const fetchBiodatas = async () => {
            try {
                setLoading(true);
                const response = await api.biodata.get();
                if (response.ok) {
                    const data = await response.json();
                    setBiodatas(data);
                } else {
                    setError('Failed to fetch biodatas');
                }
            } catch (err) {
                setError('Error fetching biodatas');
                console.error('Error fetching biodatas:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBiodatas();
    }, []);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        return columns;
    }, []);

    const filteredItems = React.useMemo(() => {
        let filteredBiodatas = [...biodatas];

        if (hasSearchFilter) {
            filteredBiodatas = filteredBiodatas.filter((biodata) =>
                biodata.fullName.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }
        if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
            filteredBiodatas = filteredBiodatas.filter((biodata) =>
                Array.from(statusFilter).includes(biodata.maritalStatus.toLowerCase()),
            );
        }

        return filteredBiodatas;
    }, [biodatas, filterValue, hasSearchFilter, statusFilter]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = React.useMemo(() => {
        return [...items].sort((a: Biodata, b: Biodata) => {
            // Only allow sorting on maritalStatus column
            if (sortDescriptor.column !== "maritalStatus") {
                return 0;
            }

            const first = a.maritalStatus.toLowerCase();
            const second = b.maritalStatus.toLowerCase();
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const renderCell = React.useCallback((biodata: Biodata, columnKey: React.Key) => {
        const cellValue = biodata[columnKey as keyof Biodata];

        switch (columnKey) {
            case "fullName":
                return (
                        <div>{biodata.fullName}</div>
                );
            case "biodataType":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">{cellValue}</p>
                        <p className="text-bold text-tiny capitalize text-default-400">{biodata.religion}</p>
                    </div>
                );
            case "maritalStatus":
                return (
                    <Chip
                        className="capitalize"
                        color={statusColorMap[biodata.maritalStatus.toLowerCase()] || "default"}
                        size="sm"
                        variant="flat"
                    >
                        {cellValue}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button isIconOnly size="sm" variant="light">
                                    <EllipsisVertical className="text-default-300" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem key="view">View</DropdownItem>
                                <DropdownItem key="edit">Edit</DropdownItem>
                                <DropdownItem key="delete">Delete</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    const onNextPage = React.useCallback(() => {
        if (page < pages) {
            setPage(page + 1);
        }
    }, [page, pages]);

    const onPreviousPage = React.useCallback(() => {
        if (page > 1) {
            setPage(page - 1);
        }
    }, [page]);

    const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = React.useCallback((value?: string) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Search by name..."
                        startContent={<Search />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ChevronDown className="text-small" />} variant="flat">
                                    Marital Status
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="multiple"
                                onSelectionChange={setStatusFilter}
                            >
                                {statusOptions.map((status) => (
                                    <DropdownItem key={status.uid} className="capitalize">
                                        {capitalize(status.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>

                        <Button color="primary" endContent={<Plus />}>
                            Add New
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Total {biodatas.length} biodatas</span>
                    <label className="flex items-center text-default-400 text-small">
                        Rows per page:
                        <select
                            className="bg-transparent outline-solid outline-transparent text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [filterValue, onSearchChange, statusFilter, biodatas.length, onRowsPerPageChange, onClear]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400">
                    {selectedKeys === "all"
                        ? "All items selected"
                        : `${selectedKeys.size} of ${filteredItems.length} selected`}
                </span>
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={pages}
                    onChange={setPage}
                />
                <div className="hidden sm:flex w-[30%] justify-end gap-2">
                    <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
                        Previous
                    </Button>
                    <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
                        Next
                    </Button>
                </div>
            </div>
        );
    }, [selectedKeys, filteredItems.length, page, pages, onPreviousPage, onNextPage]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg">Loading biodatas...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg text-red-500">Error: {error}</div>
            </div>
        );
    }

    return (
        <Table
            isHeaderSticky
            aria-label="Example table with custom cells, pagination and sorting"
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            classNames={{
                wrapper: "max-h-[382px]",
            }}
            selectedKeys={selectedKeys}
            selectionMode="multiple"
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
        >
            <TableHeader columns={headerColumns}>
                {(column) => (
                    <TableColumn
                        key={column.uid}
                        align={column.uid === "actions" ? "center" : "start"}
                        allowsSorting={column.sortable}
                    >
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody emptyContent={"No biodatas found"} items={sortedItems}>
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
