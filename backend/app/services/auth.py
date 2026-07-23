from supabase import create_client, Client
from app.schemas.auth import UserLogin, UserRegister, TokenSchema, OAuthUrlSchema
import os

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://your-project.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY", "your-anon-key")

class AuthService:
    def __init__(self):
        self.supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

    async def register_user(self, user_data: UserRegister) -> TokenSchema:
        """
        Registers a new user via Supabase Auth and injects their role into metadata.
        """
        try:
            res = self.supabase.auth.sign_up({
                "email": user_data.email,
                "password": user_data.password,
                "options": {
                    "data": {
                        "role": user_data.role
                    }
                }
            })
            if not res.session:
                raise ValueError("Registration failed or requires email confirmation.")
            
            return TokenSchema(
                access_token=res.session.access_token,
                refresh_token=res.session.refresh_token,
                expires_in=res.session.expires_in
            )
        except Exception as e:
            raise ValueError(str(e))

    async def login_user(self, user_data: UserLogin) -> TokenSchema:
        """
        Authenticates a user via Supabase Auth.
        """
        try:
            res = self.supabase.auth.sign_in_with_password({
                "email": user_data.email,
                "password": user_data.password
            })
            return TokenSchema(
                access_token=res.session.access_token,
                refresh_token=res.session.refresh_token,
                expires_in=res.session.expires_in
            )
        except Exception as e:
            raise ValueError("Invalid email or password.")

    async def get_oauth_url(self, provider: str = "google", redirect_to: str = "http://localhost:3000/auth/callback") -> OAuthUrlSchema:
        """
        Returns the OAuth consent screen URL.
        """
        try:
            res = self.supabase.auth.sign_in_with_oauth({
                "provider": provider,
                "options": {
                    "redirect_to": redirect_to
                }
            })
            return OAuthUrlSchema(provider=provider, url=res.url)
        except Exception as e:
            raise ValueError(str(e))
