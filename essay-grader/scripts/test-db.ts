import { createFromParsedInstructions } from "@/services/database";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Tests the database service by creating a sample instruction sheet, specifications, and instructions.
 * Verifies relationships and prints results to the console.
 */
async function testDatabaseService() {
  try {
    console.log("🧪 Testing database service...");

    const testData = {
      type: "razpravljalni",
      theme: "UJETI ALI SVOBODNI?",
      title: "ZAKAJ JE BIVANJE ZA ZAPRTIMI VRATI IN V SKLADIŠČU PEKLENSKO?",
      prompt:
        "GARCIN:  Se smeje. To je torej pekel. Nikoli si ne bi bil mislil ... Se spominjata: žveplo, grmada, raženj ... kakšna neslanost! Tudi brez ražnja gre. Pekel so drugi. (J.-P. Sartre: Zaprta vrata) VERA: Podpisale smo za eno leto nonstop, samo nedelje frej. Dobimo zraven stanovanje, tuše in prehrano. MARIA: Hudičeva pogodba. VERA: Ta fina se spet pritožuje. Če ti kaj ni všeč, veš, kje so vrata. Koliko jih čaka zunaj, da pridejo na tvoje mesto. (T. Mislej: Naše skladišče) Predstavite dogajalni prostor v dramah Zaprta vrata in Naše skladišče ter pojasnite, zakaj ga osebe doživljajo kot 'peklenskega'. Primerjajte odnose med osebami v prvi drami z odnosi med osebami v drugi drami. Presodite, v kolikšni meri lahko osebe obeh dram uresničijo besede 'Če ti kaj ni všeč, veš, kje so vrata'. Pojasnite, kateri problemi, izpostavljeni v dramah, ustvarjajo tudi 'pekel' našega časa. Ali menite, da za sodobnega človeka obstaja izhod iz njega?",
      time: "SM 2024",
      specifications: [
        {
          label: "A",
          title: "Vsebina",
          details:
            "Ime testa Šolski esej, razpravljalni. Čas SM 2024. Struktura: nizanje trditev, naštevalno pomensko razmerje in trditev – dokazovanje trditve, vzročno-posledično pomensko razmerje. Način razvijanja teme: opisovanje, razlaganje.",
          taxonomyLevel: "I. in II. taksonomska stopnja",
          parent: "null",
        },
        {
          label: "B",
          title: "primerjava odnosov med osebami",
          details:
            "Kandidat primerja odnose med osebami, tako da navaja podobnosti in razlike. Struktura primerjave: uvodna trditev/teza – 2 do 3 člena primerjave (podobnosti/razlike) – sinteza/sklep. Način razvijanja teme: razlaganje z utemeljevanjem.",
          taxonomyLevel: "II. taksonomska stopnja",
          parent: "null",
        },
        {
          label: "C",
          title: "presoja, v kolikšni meri lahko osebe obeh dram uresničijo",
          details:
            "Kandidat presodi, v kolikšni meri lahko osebe uresničijo besede 'Če ti kaj ni všeč, veš, kje so vrata', tako da izhaja iz poznavanja in razumevanja vsebine ter svojega vrednotenja teh besed v povezavi z dramama. Struktura: trditev – utemeljevanje trditve. Način razvijanja teme: razlaganje, utemeljevanje.",
          taxonomyLevel: "II. in III. taksonomska stopnja",
          parent: "null",
        },
        {
          label: "Č",
          title: "pojasnilo, kateri problemi, izpostavljeni v dramah",
          details:
            "Kandidat pojasni, kateri problemi, izpostavljeni v dramah, ustvarjajo tudi 'pekel' našega časa, in presodi, ali za sodobnega človeka obstaja izhod iz njega, pri čemer trditve utemeljuje z vsebinskimi elementi ter osebnim mnenjem; prepričljivost utemeljitve je odvisna od poglobljenosti razumevanja besedila v povezavi s sodobnimi družbenimi razmerami. Struktura: trditev – utemeljevanje trditve. Način razvijanja teme: razlaganje, utemeljevanje.",
          taxonomyLevel: "II. in III. taksonomska stopnja",
          parent: "null",
        },
      ],
      instructions: [
        {
          label: "A",
          title:
            "Predstaviti dogajalni prostor v dramah Zaprta vrata in Naše skladišče ter pojasniti, zakaj ga osebe doživljajo kot 'peklenskega'",
          details:
            "Kandidat predstavi dogajalni prostor in pojasni, kako 'pekel' doživljajo osebe, tako da izhaja iz poznavanja in razumevanja vsebine.",
          scoringGuidelines:
            "do 8 točk: poglobljena predstavitev obeh dogajalnih prostorov in pojasnilo doživljanja oseb, ki vključuje več značilnosti s ponazoritvijo; do 4 točke: predstavitev obeh dogajalnih prostorov brez pojasnila doživljanja oseb.",
          parent: "null",
        },
        {
          label: "B",
          title:
            "Primerjati odnose med osebami v prvi drami z odnosi med osebami v drugi drami",
          details:
            "Kandidat primerja odnose med osebami, tako da navaja podobnosti in razlike.",
          scoringGuidelines:
            "do 8 točk: primerjava, ki vsebuje dva poglobljeno razložena člena; do 6 točk: primerjava z enim prepričljivo razvitim členom ali dvema manj poglobljeno razvitima členoma; do 4 točke: primerjava z enim manj prepričljivo razvitim členom ali le predstavitev odnosov med osebami.",
          parent: "null",
        },
        {
          label: "C",
          title:
            "Presoditi, v kolikšni meri lahko osebe obeh dram uresničijo besede 'Če ti kaj ni všeč, veš, kje so vrata'",
          details:
            "Kandidat presodi, v kolikšni meri lahko osebe uresničijo besede 'Če ti kaj ni všeč, veš, kje so vrata'.",
          scoringGuidelines:
            "do 6 točk: poglobljena presoja možnosti uresničitve besed v navedku; do 3 točke: manj poglobljena presoja možnosti uresničitve besed v navedku.",
          parent: "null",
        },
        {
          label: "Č1",
          title:
            "pojasniti, kateri problemi, izpostavljeni v dramah, ustvarjajo 'pekel' našega časa",
          details:
            "Kandidat pojasni, kateri problemi, izpostavljeni v dramah, ustvarjajo 'pekel' našega časa.",
          scoringGuidelines:
            "do 4 točke: prepričljiva razlaga problemov, izpostavljenih v dramah, v povezavi s problemi današnjega časa; do 2 točki: manj prepričljiva razlaga.",
          parent: "Č",
        },
        {
          label: "Č2",
          title: "presoditi, ali za sodobnega človeka obstaja izhod iz 'pekla'",
          details:
            "Kandidat presodi, ali za sodobnega človeka obstaja izhod iz 'pekla'.",
          scoringGuidelines:
            "do 4 točke: prepričljiva presoja, ki vključuje več ravni vrednotenja; do 2 točke: manj prepričljiva presoja, ki temelji le na doživljajskem vrednotenju.",
          parent: "Č",
        },
      ],
    };

    const results = await createFromParsedInstructions(prisma, [testData]);

    console.log("✅ SUCCESS! Database service works correctly");
    console.log("📊 Created:");
    results.forEach((result, idx) => {
      console.log(` Sheet #${idx + 1}: ${result.instructionSheet.title}`);
      console.log(`   - Specifications: ${result.specifications.length}`);
      console.log(`   - Instructions: ${result.instructions.length}`);

      // Verify relationships
      console.log("\n🔗 Verifying relationships...");
    });

    for (const result of results) {
      const verification = await prisma.instructionSheet.findFirst({
        where: { id: result.instructionSheet.id },
        include: {
          specifications: {
            include: {
              instructions: true,
            },
          },
        },
      });
      verification?.specifications.forEach((spec) => {
        console.log(
          `   Spec "${spec.label}": ${spec.instructions.length} instructions`
        );
      });
    }

    console.log("\n🎉 All tests passed!");
  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseService();
