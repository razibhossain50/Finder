"use client"
import type { SVGProps } from "react";
import type { Selection, ChipProps, SortDescriptor } from "@heroui/react";
import React from "react";
import {
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, DropdownTrigger,
    Dropdown, DropdownMenu, DropdownItem, Chip, User, Pagination, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter
} from "@heroui/react";
import { Plus, EllipsisVertical, Search, ChevronDown, Trash2 } from "lucide-react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
    size?: number;
};

export function capitalize(s: string) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}


// Columns based on your database schema
export const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "FULL NAME", uid: "fullName", sortable: true },
    { name: "EMAIL", uid: "email", sortable: true },
    { name: "ROLE", uid: "role", sortable: true },
    { name: "CREATED AT", uid: "createdAt", sortable: true },
    { name: "UPDATED AT", uid: "updatedAt", sortable: true },
    { name: "ACTIONS", uid: "actions" },
];

// Role options based on your database
export const roleOptions = [
    { name: "User", uid: "user" },
    { name: "Admin", uid: "admin" },
    { name: "Superadmin", uid: "superadmin" },
];

// User interface based on your database schema
interface DatabaseUser {
    id: number;
    email: string;
    password: string; // Won't display this
    role: string;
    createdAt: string;
    updatedAt: string;
    fullName: string | null;
}

const roleColorMap: Record<string, ChipProps["color"]> = {
    user: "default",
    admin: "primary",
    superadmin: "success",
};

export default function Users() {
    const [users, setUsers] = React.useState<DatabaseUser[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
    const [roleFilter, setRoleFilter] = React.useState<Selection>("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
        column: "id",
        direction: "ascending",
    });
    const [page, setPage] = React.useState(1);

    // Delete confirmation modal state
    const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
    const [userToDelete, setUserToDelete] = React.useState<DatabaseUser | null>(null);
    const [isDeleting, setIsDeleting] = React.useState(false);

    // Fetch all users from API
    React.useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                // Try admin_access_token first, then fall back to access_token
                const adminToken = localStorage.getItem('admin_access_token');
                const userToken = localStorage.getItem('access_token');
                const token = adminToken || userToken;

                if (!token) {
                    setError('No authentication token found. Please login as admin.');
                    setLoading(false);
                    return;
                }

                console.log('Fetching users with token:', token ? 'Token found' : 'No token');

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                });

                console.log('Users API response status:', response.status);

                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                } else {
                    const errorText = await response.text();
                    console.error('Users API error:', errorText);
                    setError(`Failed to fetch users - ${response.status}: ${response.statusText}`);
                }
            } catch (err) {
                setError('Error fetching users');
                console.error('Error fetching users:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Handle user deletion
    const handleDeleteUser = async () => {
        if (!userToDelete) return;

        try {
            setIsDeleting(true);
            // Try admin_access_token first, then fall back to access_token
            const adminToken = localStorage.getItem('admin_access_token');
            const userToken = localStorage.getItem('access_token');
            const token = adminToken || userToken;

            if (!token) {
                console.error('No authentication token found');
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${userToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                // Remove user from local state
                setUsers(prev => prev.filter(user => user.id !== userToDelete.id));
                setDeleteModalOpen(false);
                setUserToDelete(null);
            } else {
                const errorText = await response.text();
                console.error('Failed to delete user:', response.status, errorText);
                alert('Failed to delete user. Please try again.');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Error deleting user. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        return columns;
    }, []);

    const filteredItems = React.useMemo(() => {
        let filteredUsers = [...users];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) =>
                (user.fullName?.toLowerCase().includes(filterValue.toLowerCase()) || false) ||
                user.email.toLowerCase().includes(filterValue.toLowerCase())
            );
        }
        if (roleFilter !== "all" && Array.from(roleFilter).length !== roleOptions.length) {
            filteredUsers = filteredUsers.filter((user) =>
                Array.from(roleFilter).includes(user.role),
            );
        }

        return filteredUsers;
    }, [users, filterValue, roleFilter, hasSearchFilter]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = React.useMemo(() => {
        return [...items].sort((a: DatabaseUser, b: DatabaseUser) => {
            let first: any = a[sortDescriptor.column as keyof DatabaseUser];
            let second: unknown = b[sortDescriptor.column as keyof DatabaseUser];

            // Handle null values
            if (first === null) first = "";
            if (second === null) second = "";

            // Convert to string for comparison if needed
            if (typeof first === 'string') first = first.toLowerCase();
            if (typeof second === 'string') second = second.toLowerCase();

            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderCell = React.useCallback((user: DatabaseUser, columnKey: React.Key) => {
        const cellValue = user[columnKey as keyof DatabaseUser];

        switch (columnKey) {
            case "fullName":
                return (
                    <User
                        avatarProps={{
                            radius: "lg",
                            src: `https://i.pravatar.cc/150?u=${user.email}`,
                            name: user.fullName || user.email.charAt(0).toUpperCase()
                        }}
                        description={user.email}
                        name={user.fullName || "No name"}
                    >
                        {user.email}
                    </User>
                );
            case "role":
                return (
                    <Chip
                        className="capitalize"
                        color={roleColorMap[user.role] || "default"}
                        size="sm"
                        variant="flat"
                    >
                        {user.role}
                    </Chip>
                );
            case "createdAt":
            case "updatedAt":
                return (
                    <span className="text-small">
                        {formatDate(cellValue as string)}
                    </span>
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
                            <DropdownMenu onAction={(key) => {
                                if (key === "delete") {
                                    setUserToDelete(user);
                                    setDeleteModalOpen(true);
                                }
                            }}>
                                <DropdownItem key="view">View</DropdownItem>
                                <DropdownItem key="edit">Edit</DropdownItem>
                                <DropdownItem
                                    key="delete"
                                    className="text-danger"
                                    color="danger"
                                    startContent={<Trash2 className="w-4 h-4" />}
                                >
                                    Delete
                                </DropdownItem>
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
                        placeholder="Search by name or email..."
                        startContent={<Search />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ChevronDown className="text-small" />} variant="flat">
                                    Role
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Role Filter"
                                closeOnSelect={false}
                                selectedKeys={roleFilter}
                                selectionMode="multiple"
                                onSelectionChange={setRoleFilter}
                            >
                                {roleOptions.map((role) => (
                                    <DropdownItem key={role.uid} className="capitalize">
                                        {capitalize(role.name)}
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
                    <span className="text-default-400 text-small">Total {users.length} users</span>
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
    }, [filterValue, roleFilter, onSearchChange, onRowsPerPageChange, users.length, onClear]);

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
                <div className="text-lg">Loading users...</div>
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
        <>
            <Table
                isHeaderSticky
                aria-label="Admin users table with delete functionality"
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
                <TableBody emptyContent={"No users found"} items={sortedItems}>
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                <ModalContent>
                    <ModalHeader>
                        <h3 className="text-lg font-semibold text-danger">Confirm Delete User</h3>
                    </ModalHeader>
                    <ModalBody>
                        {userToDelete && (
                            <div className="space-y-4">
                                <p>Are you sure you want to delete this user? This action cannot be undone.</p>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="space-y-2">
                                        <div>
                                            <span className="text-sm text-gray-600">ID:</span>
                                            <span className="ml-2 font-semibold">{userToDelete.id}</span>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-600">Name:</span>
                                            <span className="ml-2 font-semibold">{userToDelete.fullName || "No name"}</span>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-600">Email:</span>
                                            <span className="ml-2 font-semibold">{userToDelete.email}</span>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-600">Role:</span>
                                            <Chip
                                                className="ml-2"
                                                color={roleColorMap[userToDelete.role] || "default"}
                                                size="sm"
                                                variant="flat"
                                            >
                                                {userToDelete.role}
                                            </Chip>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="light"
                            onPress={() => setDeleteModalOpen(false)}
                            isDisabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            color="danger"
                            onPress={handleDeleteUser}
                            isLoading={isDeleting}
                            startContent={!isDeleting ? <Trash2 className="w-4 h-4" /> : null}
                        >
                            {isDeleting ? "Deleting..." : "Delete User"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
