"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { type UserRole } from "@/schemas/user.schema"
import { getAllUsersService } from "@/services/admin.service"
import { Loader2 } from "lucide-react"

export type User = {
  id: string
  name: string
  email: string
  address: string
  role: UserRole
}

const USERS_PER_PAGE = 4

const UserList = () => {
  const [users, setUsers] = useState<User[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  })

  const fetchAllUsers = async () => {
    setIsLoading(true)
    try {
      const response = await getAllUsersService()
      if (response) {
        setUsers(response.data.users)
      } else {
        console.error("Failed to fetch users")
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAllUsers()
  }, [])

  const filteredUsers = users.filter((user) => {
    const nameMatch = user.name.toLowerCase().includes(filters.name.toLowerCase())
    const emailMatch = user.email.toLowerCase().includes(filters.email.toLowerCase())
    const addressMatch = user.address.toLowerCase().includes(filters.address.toLowerCase())
    const roleMatch =
      filters.role === "" || user.role.toLowerCase().includes(filters.role.toLowerCase())

    return nameMatch && emailMatch && addressMatch && roleMatch
  })

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  )

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const resetFilters = () => {
    setFilters({ name: "", email: "", address: "", role: "" })
    setCurrentPage(1)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        <Input
          placeholder="Filter by name"
          value={filters.name}
          onChange={(e) => {
            setFilters((f) => ({ ...f, name: e.target.value }))
            setCurrentPage(1)
          }}
        />
        <Input
          placeholder="Filter by email"
          value={filters.email}
          onChange={(e) => {
            setFilters((f) => ({ ...f, email: e.target.value }))
            setCurrentPage(1)
          }}
        />
        <Input
          placeholder="Filter by address"
          value={filters.address}
          onChange={(e) => {
            setFilters((f) => ({ ...f, address: e.target.value }))
            setCurrentPage(1)
          }}
        />
        <select
          className="border rounded px-2 py-1"
          value={filters.role}
          onChange={(e) => {
            setFilters((f) => ({ ...f, role: e.target.value }))
            setCurrentPage(1)
          }}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="store_owner">Owner</option>
        </select>
        <Button onClick={resetFilters}>Clear</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                <Loader2 className="animate-spin" size={16} />
              </TableCell>
            </TableRow>
          ) : paginatedUsers.length ? (
            paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell className="capitalize">
                  {user.role.replace("_", " ").toLowerCase()}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {filteredUsers.length > 0 && (
        <div className="flex justify-between items-center pt-4">
          <Button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            variant="outline"
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

export default UserList
