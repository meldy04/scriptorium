cd scriptorium
echo "Starting setup..."

# Install dependencies
echo "Installing npm packages..."
npm install

# Run migrations
echo "Running prisma migrations..."
npx prisma migrate dev

# Start deployment
echo "Startup script executed successfully."

echo "Running Prisma migrations..."
npx prisma migrate deploy

# Verify compilers/interpreters
echo "Checking compilers/interpreters..."
if ! command -v gcc &> /dev/null; then
    echo "GCC is not installed. Please install it to proceed."
    exit 1
fi
if ! command -v g++ &> /dev/null; then
    echo "G++ is not installed. Please install it to proceed."
    exit 1
fi
if ! command -v python3 &> /dev/null; then
    echo "Python3 is not installed. Please install it to proceed."
    exit 1
fi
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install it to proceed."
    exit 1
fi
echo "All required compilers/interpreters are installed."

# Create admin user
echo "Creating admin user..."
node -e "
const prisma = require('./utils/db');
(async () => {
    await prisma.user.create({
        data: { username: 'admin', password: 'admin123', role: 'ADMIN' }
    });
    console.log('Admin user created successfully');
    await prisma.$disconnect();
})();
"
echo "Setup complete."