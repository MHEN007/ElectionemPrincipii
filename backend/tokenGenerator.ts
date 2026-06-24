import bcrypt from "bcrypt"
import "dotenv/config"

console.log(await bcrypt.hash("ABCDEF", 12))

