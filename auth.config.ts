import type { AuthOptions } from 'next-auth'
import { updateUser } from './lib/actions/users.actions';

// Notice this is only an object, not a full Auth.js instance
const authConfig: AuthOptions = {
  providers: [],
  callbacks: {
    async signIn({ user }: { user: import('next-auth').User; account: import('next-auth').Account | null }) {
         // Mettre à jour l'utilisateur dans la base de données
         await updateUser(user.id, {
          name: user.name || user.email!.split("@")[0],
          role: "user",
        });
      return true
    },
  },
}

export default authConfig
