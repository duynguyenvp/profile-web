import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(
    new GoogleStrategy({
        clientID: '86601090354-p3o3njgfn974cemk884belasoenftno3.apps.googleusercontent.com',
        clientSecret: '5zZnviXESfPCbc3MdHaCld19',
        callbackURL: '/account/auth/google/callback',
        proxy: true
    },
        async (accessToken, refreshToken, profile, done) => {
            const user = {
                oauthId: profile.id,
                username: profile.emails[0].value,
                email: profile.emails[0].value,
                fullName: profile.name.familyName + ' ' + profile.name.givenName
            }
            done(null, user);
        })
);