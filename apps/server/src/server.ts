import app from "./app"
import { connectDB, config } from "./config"

connectDB()

app.listen(config.PORT, () => {
  console.log(`Server running on http://localhost:${config}`)
})
