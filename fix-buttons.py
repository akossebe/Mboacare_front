import re

with open('Mboacare_front/src/app/features/consultation/pages/tableau-de-bord-patient/tableau-de-bord-patient.html', 'r') as f:
    c = f.read()

# Fix Historique complet
c = c.replace('<button\n                class="text-secondary hover:text-on-secondary-container font-label-md text-label-md flex items-center gap-spacing-2xs transition-colors"\n                type="button">\n                <span>Voir l’historique complet</span>', 
              '<a routerLink="/patient/historique-medical"\n                class="text-secondary hover:text-on-secondary-container font-label-md text-label-md flex items-center gap-spacing-2xs transition-colors">\n                <span>Voir l’historique complet</span>')
c = c.replace('<span>Voir l’historique complet</span>\n                <span class="material-symbols-outlined text-title-md">arrow_forward</span>\n              </button>', 
              '<span>Voir l’historique complet</span>\n                <span class="material-symbols-outlined text-title-md">arrow_forward</span>\n              </a>')

# Fix Recapitulatif
c = c.replace('<button class="text-on-surface-variant hover:text-on-surface font-label-md text-label-md" type="button">\n                  Voir le récapitulatif\n                </button>', 
              '<a routerLink="/patient/historique-medical" class="text-on-surface-variant hover:text-on-surface font-label-md text-label-md">\n                  Voir le récapitulatif\n                </a>')

# Fix Annuler (we need to find the <button>Annuler</button> inside the remaining RDV card)
# Wait, my fix-patient.py already replaced the RDV grid with a clean HTML block!
# In fix-patient.py I used `Annuler` as just `<button *ngIf="rdv.statut === 'EN_ATTENTE'" (click)="annulerRdv(rdv.idRendezVous)" ...>Annuler</button>`!
# Oh wait, NO! `fix-patient.py` only did replacements! It DID NOT use the big `rdv_block` string like the FIRST script!
# Oh wow, `fix-patient.py` kept the original RDV 1 HTML, just added `*ngFor`!
# Okay, so I DO need to replace the `Annuler` button.

c = c.replace('<button\n                    class="px-spacing-md py-spacing-xs rounded-xl text-error hover:bg-error-container/50 font-label-md text-label-md transition-colors"\n                    type="button">\n                    Annuler\n                  </button>',
              '<button *ngIf="rdv.statut === \'EN_ATTENTE\'" (click)="annulerRdv(rdv.idRendezVous)" class="px-spacing-md py-spacing-xs rounded-xl text-error hover:bg-error-container/50 font-label-md text-label-md transition-colors" type="button">\n                    Annuler\n                  </button>')

c = c.replace('class="px-spacing-md py-spacing-xs rounded-xl text-error hover:bg-error-container/50 font-label-md text-label-md transition-colors"\n                    type="button">\n                    Annuler\n                  </button>',
              'class="px-spacing-md py-spacing-xs rounded-xl text-error hover:bg-error-container/50 font-label-md text-label-md transition-colors" type="button" *ngIf="rdv.statut === \'EN_ATTENTE\'" (click)="annulerRdv(rdv.idRendezVous)">\n                    Annuler\n                  </button>')

# Add Rejoindre
c = c.replace('<button\n                  class="flex items-center gap-spacing-xs px-spacing-lg py-spacing-xs rounded-xl bg-secondary hover:bg-on-secondary-fixed-variant text-on-secondary font-label-md text-label-md font-semibold transition-all shadow-[0_4px_12px_rgba(0,101,145,0.25)]"\n                  type="button">\n                  <span class="material-symbols-outlined text-title-md">videocam</span>\n                  <span>Rejoindre le salon vidéo</span>\n                </button>',
              '<button *ngIf="rdv.statut === \'CONFIRME\' && rdv.motifPrise?.includes(\'VIDEO\')" class="flex items-center gap-spacing-xs px-spacing-lg py-spacing-xs rounded-xl bg-secondary hover:bg-on-secondary-fixed-variant text-on-secondary font-label-md text-label-md font-semibold transition-all shadow-[0_4px_12px_rgba(0,101,145,0.25)]" type="button">\n                  <span class="material-symbols-outlined text-title-md">videocam</span>\n                  <span>Rejoindre le salon vidéo</span>\n                </button>')

with open('Mboacare_front/src/app/features/consultation/pages/tableau-de-bord-patient/tableau-de-bord-patient.html', 'w') as f:
    f.write(c)

