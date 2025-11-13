import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"

export default function NotFound() {
    const navigate = useNavigate()

    return (
        <div className="flex min-h-screen items-center justify-center bg-blue-50">
            <Card className="w-full max-w-md border-blue-200 shadow-lg">
                <CardContent className="text-center py-12">
                    <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
                    <p className="text-gray-600 text-lg mb-6">
                        Oops! The page you’re looking for doesn’t exist.
                    </p>
                    <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => navigate("/")}
                    >
                        Go Back Home
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
