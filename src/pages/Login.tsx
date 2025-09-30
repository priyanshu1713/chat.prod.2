import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

const Login = () => {
	const { signInWithGoogle, session, loading } = useAuth();
	const location = useLocation();
	const navigate = useNavigate();

	if (session && !loading) {
		const from = (location.state as any)?.from?.pathname || "/";
		navigate(from, { replace: true });
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-background">
			<Card className="w-full max-w-sm">
				<CardContent className="p-6 space-y-4">
					<h1 className="text-xl font-semibold">Sign in</h1>
					<p className="text-sm text-text-muted">Continue with your Google account.</p>
					<Button onClick={signInWithGoogle} className="w-full">Sign in with Google</Button>
				</CardContent>
			</Card>
		</div>
	);
}

export default Login;

