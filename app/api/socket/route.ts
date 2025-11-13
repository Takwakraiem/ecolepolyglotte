// import { Server } from "socket.io"
// import { NextApiResponse } from "next"
// import type { NextApiRequest } from "next"

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// }

// let io: Server | null = null

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (!io) {
//     if (!res.socket) {
//       // socket might be null in some environments — end the response early
//       res.status(500).end("Socket not available")
//       return
//     }

//     const httpServer: any = res.socket.server
//     io = new Server(httpServer, {
//       path: "/api/socket",
//       cors: {
//         origin: "*",
//       },
//     })

//     io.on("connection", (socket) => {
//       console.log("✅ New socket connected:", socket.id)
//       socket.on("disconnect", () => {
//         console.log("❌ Socket disconnected:", socket.id)
//       })
//     })

//     res.socket.server.io = io
//   }
//   res.end()
// }
