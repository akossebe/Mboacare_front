const fs = require('fs');
const file = 'src/app/shared/components/navbar/navbar.component.html';
let content = fs.readFileSync(file, 'utf8');

const tdbDesktop = `
      <!-- Pharmacien -->
      <a routerLink="/pharmacien/tableau-de-bord" routerLinkActive="bg-primary-container text-on-primary font-semibold"
         class="px-3 py-2 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all flex items-center gap-1.5">
        <span class="material-symbols-outlined text-base">dashboard</span>
        Tableau de bord
      </a>`;

const tdbMobile = `
      <div class="text-xs font-bold uppercase tracking-wider text-on-surface-variant px-3 pt-1">Espace Pharmacien</div>
      <a routerLink="/pharmacien/tableau-de-bord" (click)="menuOuvert = false" routerLinkActive="bg-primary-container text-on-primary font-semibold"
         class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-on-surface hover:bg-surface-container transition-all">
        <span class="material-symbols-outlined text-lg">dashboard</span>
        Tableau de bord
      </a>`;

content = content.replace('<!-- Pharmacien -->', tdbDesktop);
content = content.replace('<div class="text-xs font-bold uppercase tracking-wider text-on-surface-variant px-3 pt-1">Espace Pharmacien</div>', tdbMobile);

fs.writeFileSync(file, content);
