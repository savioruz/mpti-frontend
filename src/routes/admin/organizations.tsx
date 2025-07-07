import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Eye, Edit, Trash2, Plus, Search } from "lucide-react"
import { useState } from 'react'

export const Route = createFileRoute('/admin/organizations')({
  component: OrganizationManagement,
})

interface Organization {
  id: number
  code: string
  name: string
  status: 'Active' | 'Inactive'
  createdBy: string
  createdDate: string
  updatedBy: string
  updatedDate: string
}

const mockOrganizations: Organization[] = [
  {
    id: 1,
    code: 'MT01',
    name: 'Multi Terminal Aja',
    status: 'Active',
    createdBy: 'Saya Admin',
    createdDate: '05-06-2025 13:29:35',
    updatedBy: 'Saya Admin',
    updatedDate: '19-06-2025'
  },
  {
    id: 2,
    code: 'MT04',
    name: 'Multi Terminal Priok 04',
    status: 'Active',
    createdBy: 'Saya Admin',
    createdDate: '13-06-2025 10:23:24',
    updatedBy: 'Saya Admin',
    updatedDate: '19-06-2025'
  },
  {
    id: 3,
    code: 'MT03',
    name: 'Multi Terminal Priok 03',
    status: 'Inactive',
    createdBy: 'Saya Admin',
    createdDate: '11-06-2025 16:19:02',
    updatedBy: 'Saya Admin',
    updatedDate: '19-06-2025'
  },
  {
    id: 4,
    code: 'ORG3',
    name: 'Organisasi 3',
    status: 'Active',
    createdBy: 'Saya Admin',
    createdDate: '02-06-2025 20:41:25',
    updatedBy: 'Saya Admin',
    updatedDate: '19-06-2025'
  },
  {
    id: 5,
    code: 'MTI',
    name: 'PT. Multi Terminal Indonesia',
    status: 'Active',
    createdBy: 'Saya Admin',
    createdDate: '23-06-2025 11:04:31',
    updatedBy: 'Saya Admin',
    updatedDate: '23-06-2025'
  },
  {
    id: 6,
    code: 'TP01',
    name: 'Terminal Tanjung Priok T01',
    status: 'Active',
    createdBy: 'Saya Admin',
    createdDate: '30-06-2025 11:26:35',
    updatedBy: 'Saya Admin',
    updatedDate: '30-06-2025'
  },
  {
    id: 7,
    code: 'ORG2',
    name: 'Organisasi 2',
    status: 'Active',
    createdBy: 'Saya Admin',
    createdDate: '02-06-2025 14:45:23',
    updatedBy: 'Saya Admin',
    updatedDate: '06-06-2025'
  },
  {
    id: 8,
    code: 'MT02',
    name: 'Multi Terminal Priok',
    status: 'Inactive',
    createdBy: 'Saya Admin',
    createdDate: '05-06-2025 14:53:13',
    updatedBy: 'Saya Admin',
    updatedDate: '06-06-2025'
  },
  {
    id: 9,
    code: 'ORG66',
    name: 'Organisasi 266 edited',
    status: 'Active',
    createdBy: 'Saya Admin',
    createdDate: '03-06-2025 15:11:43',
    updatedBy: 'Saya Admin',
    updatedDate: '07-06-2025'
  }
]

function OrganizationManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [organizations] = useState<Organization[]>(mockOrganizations)

  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Master / Organization</h1>
          <p className="text-muted-foreground">Manage organizations in your system</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Organisasi
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Organization List</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari Nama Customer"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Kode Organisasi</TableHead>
                <TableHead>Nama Organisasi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dibuat Oleh</TableHead>
                <TableHead>Tanggal Dibuat</TableHead>
                <TableHead>Diperbarui Oleh</TableHead>
                <TableHead>Tanggal Diperbarui</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrganizations.map((org, index) => (
                <TableRow key={org.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{org.code}</TableCell>
                  <TableCell>{org.name}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={org.status === 'Active' ? 'default' : 'secondary'}
                      className={org.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                    >
                      {org.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{org.createdBy}</TableCell>
                  <TableCell>{org.createdDate}</TableCell>
                  <TableCell>{org.updatedBy}</TableCell>
                  <TableCell>{org.updatedDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
