import { Strategy } from "passport-facebook";
import passport, { PassportStatic } from "passport";

export const facebookStrategy = (passport: PassportStatic) => {
  passport.use(
    new Strategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID as string,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
        callbackURL: "/api/social/v1/auth/fb/callback",
        profileFields: ["id", "displayName", "photos", "email"],
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
