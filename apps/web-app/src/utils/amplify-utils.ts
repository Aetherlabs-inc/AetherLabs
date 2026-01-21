// // utils/amplify-utils.ts
// import { cookies } from "next/headers";

// import { createServerRunner } from '@aws-amplify/adapter-nextjs';
// import { getCurrentUser } from "aws-amplify/auth/server";



// export const { runWithAmplifyServerContext } = createServerRunner({
//     config: outputs
// });

// // export const cookiesClient = generateServerClientUsingCookies<Schema>({
// //   config,
// //   cookies,
// // });

// export async function AuthGetCurrentUserServer() {
//     try {
//         const currentUser = await runWithAmplifyServerContext({
//             nextServerContext: { cookies },
//             operation: (contextSpec) => getCurrentUser(contextSpec),
//         });
//         return currentUser;
//     } catch (error) {
//         console.error(error);
//     }
// }
