import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings } from "lucide-react"

export const Route = createFileRoute('/admin/fields-temp')({
  component: FieldManagement,
})

function FieldManagement() {
  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Field Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Settings className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Field Management Temporarily Disabled
              </h3>
              <p className="text-gray-600 mb-4 max-w-md">
                Field CRUD functionality has been temporarily disabled due to data refresh issues. 
                This feature will be re-enabled once the technical issues are resolved.
              </p>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Under Maintenance
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
