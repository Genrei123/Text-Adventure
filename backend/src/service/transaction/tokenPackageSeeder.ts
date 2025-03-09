import TokenPackage from '../../model/transaction/TokenPackageModel';

// Default token packages based on 100 PHP for 1,000 tokens
const defaultTokenPackages = [
  {
    id: 'starter',
    name: 'Starter Pack',
    tokens: 500,
    price: 50.00,
    bonus: 0,
    currency: 'PHP',
    isPopular: false
  },
  {
    id: 'basic',
    name: 'Basic Pack',
    tokens: 1000,
    price: 100.00,
    bonus: 0,
    currency: 'PHP',
    isPopular: true
  },
  {
    id: 'plus',
    name: 'Plus Pack',
    tokens: 2200,
    price: 200.00,
    bonus: 200, // 10% bonus
    currency: 'PHP',
    isPopular: false
  },
  {
    id: 'pro',
    name: 'Pro Pack',
    tokens: 5500,
    price: 500.00,
    bonus: 500, // 10% bonus
    currency: 'PHP',
    isPopular: false
  },
  {
    id: 'premium',
    name: 'Premium Pack',
    tokens: 11000,
    price: 1000.00,
    bonus: 1000, // 10% bonus
    currency: 'PHP',
    isPopular: false
  },
  {
    id: 'ultimate',
    name: 'Ultimate Pack',
    tokens: 33000,
    price: 3000.00,
    bonus: 3000, // 10% bonus
    currency: 'PHP',
    isPopular: false
  }
];

// Function to seed the token packages
const seedTokenPackages = async () => {
  try {
    for (const packageData of defaultTokenPackages) {
      await TokenPackage.findOrCreate({
        where: { id: packageData.id },
        defaults: packageData
      });
    }
    console.log('Token packages seeded successfully');
  } catch (error: any) {
    console.error('Error seeding token packages:', error);
  }
};

export default seedTokenPackages;