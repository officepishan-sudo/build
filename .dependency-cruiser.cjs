/** .dependency-cruiser.cjs - כללי שכבות ומעגלים (code-structure).
 *  npm i -D dependency-cruiser ; npx depcruise --config .dependency-cruiser.cjs app features components hooks lib
 *  משלים את ESLint boundaries: רץ גם על קבצים שלא נערכו, ומדפיס גרף (--output-type dot). */
module.exports = {
  forbidden: [
    { name: "no-circular", severity: "error", comment: "מעגל ייבוא - כמעט תמיד barrel או שני מודולים שצריכים להיות אחד", from: {}, to: { circular: true } },
    { name: "no-orphans", severity: "warn", comment: "קובץ שאיש לא מייבא - קוד מת (או entry point שצריך להיות ברשימת החריגים)",
      from: { orphan: true, pathNot: ["\\.d\\.ts$", "(^|/)(page|layout|route|loading|error|not-found|template|default)\\.tsx?$", "^middleware\\.ts$", "\\.config\\.", "^(scripts|tests|prisma)/"] }, to: {} },
    { name: "app-only-imports-features-and-shared", severity: "error", comment: "app/ = routing. UI ולוגיקה ב-features/ או components/",
      from: { path: "^app/" }, to: { path: "^app/", pathNot: ["^app/.*/_components/", "^app/.*/_lib/"] } },
    { name: "features-do-not-import-each-other", severity: "error", comment: "שני פיצ'רים שצריכים אותו דבר → lib/ או components/",
      from: { path: "^features/([^/]+)/" }, to: { path: "^features/([^/]+)/", pathNot: "^features/$1/" } },
    { name: "shared-does-not-import-features-or-app", severity: "error",
      from: { path: "^(lib|components|hooks)/" }, to: { path: "^(features|app)/" } },
    { name: "prisma-only-in-repository", severity: "error", comment: "Prisma רק ב-repository.ts / lib/db / app/**/_lib (אגרגציה חוצת-דומיין ברמת עמוד, read-only)",
      from: { pathNot: ["repository\\.ts$", "^lib/db/", "^lib/prisma\\.ts$", "^prisma/", "^tests/", "^scripts/", "(^|/)_lib/"] }, to: { path: "^(@prisma/client|lib/prisma|lib/db)" } },
    // DEC (project-wide): async Server Components under features/*/components/ are allowed to call
    // their own feature's service.ts directly (idiomatic Next.js App Router data-fetching pattern -
    // see features/projects/components/projects-list.tsx, the reference implementation). Client
    // components ('use client') must still go through actions/props, but depcruise can't distinguish
    // that statically without reading file content, so this stays a warning, not a hard gate.
    { name: "ui-does-not-import-server-code", severity: "warn", comment: "רכיב לקוח לא מייבא repository/service/mailer - דרך actions/props; רכיב שרת (async, בלי 'use client') כן רשאי לקרוא ל-service.ts של אותו פיצ'ר",
      from: { path: "^(components/|features/[^/]+/hooks/)" }, to: { path: "(repository|service|mailer|env)\\.ts$" } },
    { name: "no-barrel-imports", severity: "warn", from: {}, to: { path: "(^|/)index\\.(ts|js)$", pathNot: "node_modules" } },
    { name: "not-to-dev-dep", severity: "error", from: { path: "^(app|features|lib|components|hooks)/", pathNot: "\\.(test|spec)\\." }, to: { dependencyTypes: ["npm-dev"], dependencyTypesNot: ["type-only"] } },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: "tsconfig.json" },
    enhancedResolveOptions: { exportsFields: ["exports"], conditionNames: ["import", "require", "node", "default"] },
    reporterOptions: { dot: { collapsePattern: "node_modules/[^/]+" } },
  },
};
