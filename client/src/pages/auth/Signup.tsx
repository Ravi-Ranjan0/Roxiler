import CreateUserForm from '@/components/form/create-user-form'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const Signup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-xl shadow-md border border-gray-200 rounded-xl bg-white">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-900">
            Create Account
          </CardTitle>
          <p className="text-sm text-center text-gray-600 mt-1">
            Join us by filling in the information below
          </p>
        </CardHeader>
        <CardContent className="pt-4">
          <CreateUserForm isRegisterPage />
        </CardContent>
      </Card>
    </div>
  )
}

export default Signup
