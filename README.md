# The Emerson Empire Frontend Monorepo

This repository contains the public frontend applications for The Emerson Empire ecosystem.

## Deployment Map

| Organization / Site | Local Folder | Netlify Project | Public URL |
|---|---|---|---|
| The Emerson Empire | `Emerson_Empire` | `theemerson` | https://theemerson.netlify.app/ |
| The Emerson Agency LLC | `Agency_LandingPage` | `emersonagency` | https://emersonagency.netlify.app/ |
| Emerson Professional Development Group Landing Page | `EPDG-Landing-Page` | `emersonprofessionaldevelopment` | https://emersonprofessionaldevelopment.netlify.app/ |
| EPDG Dashboard / Platform | `epdg` | `epdg` | https://epdg.netlify.app/ |

## Deployment Rules

1. Each Netlify project must point to the correct folder listed above.
2. Production deployments should come from reviewed and merged work, preferably `main`.
3. Do not treat deploy previews as final production unless leadership has approved that temporary workflow.
4. Do not place private credentials, API secrets, personal intern data, WhatsApp messages, contracts, or sensitive client information in this repository.
5. Public-facing copy should reflect The Emerson Empire standard language: founder-led, built by interns, and credited wherever credit is due.

## Environment Notes

The `epdg` dashboard requires:

```env
VITE_API_URL=https://the-emerson-empirebackend-production.up.railway.app
VITE_MOCK_AUTH=false
```

The current backend deployment must be healthy on Railway for the dashboard to function correctly. If Railway is crashed or sleeping, the dashboard may load while API-backed login, registration, dashboard data, or admin functions fail.

## Current Stabilization Notes

- The EPDG public class registration form is: https://docs.google.com/forms/d/e/1FAIpQLSfOGM0MZ05Em3O502rC9HxvK5qzW06ATQMcMX2Fgcn9xBpncQ/viewform
- The EPDG fee waiver request form is: https://forms.gle/fWm9gHownQeorkNn7
- The fee waiver form should not request sensitive documents, Social Security numbers, government IDs, private financial records, or medical information.

## Recommended Team Workflow

1. Create a branch for each focused repair.
2. Submit a pull request into `main`.
3. Review the Netlify deploy preview before merging.
4. Merge only after the correct site, folder, form links, and routing have been checked.
5. Confirm the matching Netlify production site after merge.
