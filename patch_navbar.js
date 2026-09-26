const fs = require('fs');
const file = 'src/app/shared/components/navbar/navbar.component.html';
let content = fs.readFileSync(file, 'utf8');

const pharmacienLinksDesktop = `
      <div class="h-5 w-[1px] bg-outline-variant/50 mx-1"></div>
      <!-- Pharmacien -->
      <a routerLink="/pharmacien/gestion-stock" routerLinkActive="bg-primary-container text-on-primary font-semibold"
         class="px-3 py-2 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all flex items-center gap-1.5">
        <span class="material-symbols-outlined text-base">inventory_2</span>
        Stocks
      </a>
      <a routerLink="/pharmacien/liste-pharmacies" routerLinkActive="bg-primary-container text-on-primary font-semibold"
         class="px-3 py-2 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all flex items-center gap-1.5">
        <span class="material-symbols-outlined text-base">storefront</span>
        Réseau
      </a>
      <a routerLink="/pharmacien/reception-prescription" routerLinkActive="bg-primary-container text-on-primary font-semibold"
         class="px-3 py-2 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all flex items-center gap-1.5">
        <span class="material-symbols-outlined text-base">receipt_long</span>
        Ordonnances
      </a>
`;

const pharmacienLinksMobile = `
      <div class="border-t border-surface-container my-2"></div>
      <div class="text-xs font-bold uppercase tracking-wider text-on-surface-variant px-3 pt-1">Espace Pharmacien</div>
      <a routerLink="/pharmacien/gestion-stock" (click)="menuOuvert = false" routerLinkActive="bg-primary-container text-on-primary font-semibold"
         class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-on-surface hover:bg-surface-container transition-all">
        <span class="material-symbols-outlined text-lg">inventory_2</span>
        Gestion des Stocks
      </a>
      <a routerLink="/pharmacien/liste-pharmacies" (click)="menuOuvert = false" routerLinkActive="bg-primary-container text-on-primary font-semibold"
         class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-on-surface hover:bg-surface-container transition-all">
        <span class="material-symbols-outlined text-lg">storefront</span>
        Réseau des Pharmacies
      </a>
      <a routerLink="/pharmacien/reception-prescription" (click)="menuOuvert = false" routerLinkActive="bg-primary-container text-on-primary font-semibold"
         class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-on-surface hover:bg-surface-container transition-all">
        <span class="material-symbols-outlined text-lg">receipt_long</span>
        Réception d'Ordonnances
      </a>
`;

content = content.replace('</nav>', pharmacienLinksDesktop + '    </nav>');
content = content.replace('</div>\n  }\n</header>', pharmacienLinksMobile + '    </div>\n  }\n</header>');
fs.writeFileSync(file, content);
