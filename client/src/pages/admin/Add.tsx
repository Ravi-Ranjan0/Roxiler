import CreateUserForm from '@/components/form/create-user-form'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const Add = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-xl shadow-md border border-gray-200 rounded-2xl bg-white">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold text-center text-indigo-600">
            Create New Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CreateUserForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default Add
