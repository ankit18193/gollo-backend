import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as MicrosoftStrategy } from "passport-microsoft";
import { Strategy as GitHubStrategy } from "passport-github2";


import User from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();


const handleSocialAuth = async (provider, profile, done) => {
  try {
    const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
    
    
    let user = await User.findOne({ providerId: profile.id });

    if (user) {
      return done(null, user);
    }

    
    if (email) {
      user = await User.findOne({ email });
      if (user) {
        
        user.provider = provider;
        user.providerId = profile.id;
        user.avatar = profile.photos ? profile.photos[0].value : user.avatar;
        await user.save();
        return done(null, user);
      }
    }

    
    user = await User.create({
      name: profile.displayName || profile.username || "User",
      email: email || `no-email-${profile.id}@${provider}.com`, // Fallback
      provider: provider,
      providerId: profile.id,
      avatar: profile.photos ? profile.photos[0].value : "",
      password: "", 
    });

    return done(null, user);

  } catch (error) {
    return done(error, null);
  }
};




if (process.env.GOOGLE_CLIENT_ID) {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `/api/auth/google/callback`
    }, (accessToken, refreshToken, profile, done) => handleSocialAuth("google", profile, done))
  );
}


if (process.env.MICROSOFT_CLIENT_ID) {
  passport.use(new MicrosoftStrategy({
      clientID: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      callbackURL: "/api/auth/microsoft/callback",
      scope: ['user.read']
    }, (accessToken, refreshToken, profile, done) => handleSocialAuth("microsoft", profile, done))
  );
}


if (process.env.GITHUB_CLIENT_ID) {
  passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/api/auth/github/callback"
    }, (accessToken, refreshToken, profile, done) => handleSocialAuth("github", profile, done))
  );
}




export default passport;