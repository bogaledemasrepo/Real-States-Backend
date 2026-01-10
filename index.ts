import app from './app'; // Import the app you just shared

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}/api/v1`);
  console.log(`📄 Documentation: http://localhost:${PORT}/api/v1/api-docs`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/v1/health`);
});