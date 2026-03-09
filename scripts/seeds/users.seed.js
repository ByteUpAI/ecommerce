import bcrypt from 'bcryptjs';

export async function seedUsers(UserModel) {
    console.log('👥 Seeding users...');
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUsers = [
        {
            role: 'admin',
            name: 'Admin User',
            email: 'admin@aircontrol.com',
            password: hashedPassword,
            isEmailVerified: true,
            phone: '+91 9876543210',
            address: 'Mumbai, Maharashtra'
        }
    ];
    
    const users = [];
    
    for (const userData of adminUsers) {
        try {
            const user = await UserModel.create(userData);
            users.push(user);
            console.log(`   ✓ Created: ${user.email}`);
        } catch (error) {
            if (error.code === 11000) {
                const existing = await UserModel.findOne({ email: userData.email });
                users.push(existing);
                console.log(`   ⚠️ Already exists: ${userData.email}`);
            } else {
                throw error;
            }
        }
    }
    
    console.log(`✅ Total users: ${users.length}\n`);
    return users;
}
