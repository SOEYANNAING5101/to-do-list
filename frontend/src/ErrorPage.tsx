import { useRouteError, isRouteErrorResponse } from "react-router-dom";
export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);
    let errorMessage = "An unexpected error occurred."
    if (isRouteErrorResponse(error)) {
        errorMessage = error.statusText;
    } else if (error instanceof Error) {
        errorMessage = error.message;
    }
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-100">
            <h1 className="text-4xl font-bold mb-4">Oops!</h1>
            <p className="text-lg mb-4">Sorry, an unexpected error has occurred.</p>
            <p className="text-slate-500 italic">
                {errorMessage}
            </p>
            <a href="/" className="mt-6 p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Go back home
            </a>
        </div>
    );
}