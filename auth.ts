import Google from 'next-auth/providers/google'

import CredentialsProvider from 'next-auth/providers/credentials'

import NextAuth, { type DefaultSession } from 'next-auth'
import authConfig from './auth.config'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import { clientPromise } from './lib/actions/mongodb'
import { updateUser } from './lib/actions/users.actions'

declare module 'next-auth' {
  interface Session {
    user: {
      role: string
    } & DefaultSession['user']
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  pages: {
    signIn: '/fr/sign-in',
    newUser: '/fr/sign-up',
    error: '/fr/sign-in',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      credentials: {
        email: {
          type: 'email',
        },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        console.log("1bbbbbbbbbb"+credentials)
     //   await connectToDatabase()
        if (credentials == null) return null
       const client = await clientPromise
        const db = client.db("dataencommun_2024")
        const collection = db.collection("users")
       
        const user = await collection.findOne({ email: credentials.email })
        console.log("3bbbbbbbbbb"+user)  
     
        
        if (user && user.password && user.emailVerified) {
          const isMatch =true
          //  await bcrypt.compare(
          //   credentials.password as string,
          //   user.password
          // )
          if (credentials.password==user.password)  {
            console.log("ismatch"+isMatch)
            return {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
              role: user.role,
            }
          }
        }
        return null
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      console.log("jwtttttttttttttttttttttttttttttttttt"+user)
      if (user) {
        if (!user.name) {
          await updateUser(user.id, {
            name: user.name || user.email!.split("@")[0],
            role: "user",
          });
        }
        //token.name = user.name || user.email!.split('@')[0]
        //token.role = (user as { role: string }).role
        
      }

      // if (session?.user?.name && trigger === 'update') {
      //   token.name = session.user.name
      // }
      return token
    },
    session: async ({ session, user, trigger, token }) => {
       
      //session.user.email = token.sub as string
      session.user.role = token.role as string
      session.user.name = token.name
      if (trigger === 'update') {
        session.user.name = user.name
      }
      console.log("session"+session.user.name) 
      return session
    },
  },
})
