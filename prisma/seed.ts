import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Password123!", 10);

  const owner = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: { email: "demo@example.com", name: "דנה לוי", passwordHash, isAdmin: true },
  });

  const supplier = await prisma.supplier.create({
    data: {
      name: "חומרי בניין כהן בע\"מ",
      categories: ["חומרי בניין", "אינסטלציה"],
      area: "מרכז",
      products: {
        create: [
          { name: "בלוק בטון 20 ס\"מ", category: "חומרי בניין", priceMin: 6, priceMax: 8, unit: 'יח' },
          { name: "צנרת PEX 20 מ\"מ", category: "אינסטלציה", priceMin: 12, priceMax: 15, unit: "מטר" },
        ],
      },
    },
  });

  const professional = await prisma.professional.create({
    data: {
      name: "אבי כהן - קבלן שיפוצים",
      fields: ["שיפוצים", "אינסטלציה"],
      area: "מרכז",
      experienceYears: 12,
      responseTimeHours: 24,
      ratingAvg: 4.6,
    },
  });

  const project = await prisma.project.create({
    data: {
      ownerId: owner.id,
      name: "שיפוץ דירת 4 חדרים - רחוב הדובדבן",
      type: "RENOVATION",
      status: "PLANNING",
      scopeDescription: "שיפוץ כללי כולל מטבח, אמבטיה ופרקט",
      budgetLines: {
        create: [
          { category: "עבודות בנייה", plannedAmount: 80000 },
          { category: "אינסטלציה וחשמל", plannedAmount: 35000 },
          { category: "גימור וריהוט", plannedAmount: 60000 },
        ],
      },
      phases: {
        create: [
          { name: "הריסה והכנה", order: 1, status: "NOT_STARTED" },
          { name: "אינסטלציה וחשמל", order: 2, status: "NOT_STARTED" },
          { name: "גימור", order: 3, status: "NOT_STARTED" },
        ],
      },
    },
  });

  console.log("נזרעו נתוני דמו:", { owner: owner.email, supplier: supplier.name, professional: professional.name, project: project.name });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
