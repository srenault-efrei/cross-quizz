import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import dotenv from 'dotenv'

import User from '@/core/db/models/User'

dotenv.config()

/**
 * Local strategy
 */

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, next) => {
      try {
        /* const user = await User.findOne({ email },{ relations: ["rank"] })*/
        const user = await User.findOne({ email })

        if (!user) {
          next(`Sorry, login is incorrect 💩💩`, null)
          return
        }

        if (!user.checkPassword(password)) {
          next(`Sorry, login is incorrect 💩💩 `, null)
          return
        }

        next(null, user)
      } catch (err) {
        next(err.message)
      }
    }
  )
)

/**
 * JSON Web Token strategy
 */

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ENCRYPTION as string,
    },
    async (jwtPayload, next) => {
      try {
        const { uuid } = jwtPayload

        const user = await User.findOne({ where: { uuid } })

        if (!user) {
          next(`User ${uuid} doesn't exist`)
          return
        }

        next(null, user)
      } catch (err) {
        next(err.message)
      }
    }
  )
)
