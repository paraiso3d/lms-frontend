import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"

export default function NotFound() {
    const navigate = useNavigate()

    return (
        <div className="flex min-h-screen items-center justify-center bg-indigo-50">
            <Card className="w-full max-w-md border-indigo-200 shadow-lg">
                <CardContent className="text-center py-12">
                    <h1 className="text-6xl font-bold text-indigo-600 mb-4">404</h1>
                    <p className="text-gray-600 text-lg mb-6">
                        Oops! The page you’re looking for doesn’t exist.
                    </p>
                    <Button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        onClick={() => navigate("/")}
                    >
                        Go Back Home
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
