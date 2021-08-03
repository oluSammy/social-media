import { Strategy } from "passport-google-oauth20";
import passport, { PassportStatic } from "passport";

export const googleStrategy = (passport: PassportStatic) => {
  passport.use(
    new Strategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: "/api/social/v1/auth/google/callback",
      },
      (accessToken: string, refreshToken: string, profile: any, done) => {
        return done(null, profile);
      }
    )
  );
};

passport.serializeUser(function (profile: any, done) {
  done(null, profile);
});

// used to deserialize the user
passport.deserializeUser(function (profile: any, done) {
  return done(null, profile);
});
