# Scraper de Toponymie du Québec

Un scraper pour identifier les entrées de la base de données toponymique du Québec où le gouvernement demande de l'aide du public.

## Objectif

Ce scraper recherche les pages où la Commission de toponymie du Québec invite le public à fournir des informations, avec le texte spécifique :

> "La Commission de toponymie invite toute personne détenant une information sur l'un ou l'autre de ces aspects à lui en faire part."

## Fonctionnalités

- Scrape les fiches toponymiques par numéro de séquence
- Détecte automatiquement les demandes d'aide
- Extrait les informations clés (nom, type, localisation)
- Exporte les résultats en CSV et JSON
- Support pour requests (rapide) ou Selenium (pour JavaScript)

## Installation

### Prérequis

- Python 3.8+
- pip

### Installation des dépendances

```bash
cd web-scraper
pip install -r requirements.txt
```

## Utilisation

### Utilisation de base

Scraper une plage de numéros de séquence :

```bash
python toponymy_scraper.py --start 143574 --end 143600
```

### Options disponibles

```bash
python toponymy_scraper.py --help
```

Options :
- `--start NUMBER` : Numéro de séquence de départ (défaut: 143574)
- `--end NUMBER` : Numéro de séquence de fin (défaut: 143584)
- `--delay SECONDS` : Délai entre les requêtes en secondes (défaut: 1.0)
- `--selenium` : Utiliser Selenium au lieu de requests
- `--output PREFIX` : Préfixe du fichier de sortie (défaut: toponymy_help_requests)

### Exemples

**Scraper 100 entrées avec un délai de 2 secondes :**
```bash
python toponymy_scraper.py --start 143000 --end 143100 --delay 2.0
```

**Utiliser Selenium (si requests est bloqué) :**
```bash
python toponymy_scraper.py --start 143574 --end 143600 --selenium
```

**Spécifier un nom de fichier de sortie :**
```bash
python toponymy_scraper.py --start 143574 --end 143600 --output ponts_quebec
```

## Structure des données

### Fichier CSV

Le fichier CSV contient les colonnes suivantes :
- `url` : URL de la fiche
- `no_seq` : Numéro de séquence
- `name` : Nom du lieu
- `type` : Type d'entité (pont, rivière, etc.)
- `location` : Municipalité/région
- `help_request_text` : Texte complet de la demande d'aide
- `found_help_request` : Toujours True (filtré)

### Fichier JSON

Format structuré identique avec indentation pour la lisibilité.

## Utilisation programmatique

```python
from toponymy_scraper import ToponymyScraper

# Créer le scraper
scraper = ToponymyScraper(use_selenium=False)

# Scraper une entrée spécifique
entry = scraper.scrape_entry(143574)
if entry:
    print(f"Trouvé : {entry['name']}")

# Scraper une plage
results = scraper.scrape_range(143574, 143600, delay=1.0)

# Sauvegarder les résultats
scraper.save_to_csv(results, "mes_resultats.csv")
scraper.save_to_json(results, "mes_resultats.json")

# Fermer les ressources
scraper.close()
```

## Notes importantes

### Respect du serveur

- Utilisez toujours un délai approprié entre les requêtes (minimum 1 seconde)
- Ne lancez pas plusieurs instances en parallèle
- Évitez de scraper de très grandes plages d'un seul coup

### Gestion des erreurs

Si vous obtenez des erreurs 403 :
1. Augmentez le délai (`--delay 2.0` ou plus)
2. Essayez avec Selenium (`--selenium`)
3. Vérifiez que le site n'est pas en maintenance

### Performance

- **requests** : Plus rapide, moins de ressources
- **Selenium** : Plus lent mais fonctionne avec JavaScript et contourne certaines restrictions

## API CKAN (Données Québec)

Le gouvernement du Québec utilise CKAN pour certaines données ouvertes. Vous pouvez explorer :
- https://www.donneesquebec.ca/page-api/
- https://docs.ckan.org/en/latest/maintaining/datastore.html

Cependant, la base de données toponymique complète n'est pas toujours disponible via l'API CKAN, d'où l'utilité de ce scraper.

## Résultats

Les fichiers générés seront créés dans le répertoire courant :
- `toponymy_help_requests.csv`
- `toponymy_help_requests.json`

## Exemple de résultat

```json
{
  "url": "https://toponymie.gouv.qc.ca/ct/ToposWeb/fiche.aspx?no_seq=143574",
  "no_seq": "143574",
  "name": "Pont Exemple",
  "type": "Pont",
  "location": "Ville de Québec",
  "help_request_text": "La Commission de toponymie invite toute personne détenant une information...",
  "found_help_request": true
}
```

## Contribuer

Pour contribuer à ce projet :
1. Identifiez les améliorations possibles
2. Testez vos modifications
3. Soumettez vos suggestions

## Licence

Ce projet est destiné à un usage éducatif et de recherche pour aider le gouvernement du Québec avec sa base de données toponymique.

## Avertissement

Ce scraper est conçu pour un usage respectueux et légal. Assurez-vous de :
- Respecter les conditions d'utilisation du site
- Ne pas surcharger le serveur
- Utiliser les données de manière appropriée

Si vous trouvez des entrées où le gouvernement demande de l'aide, considérez contribuer vos connaissances directement à la Commission de toponymie du Québec.
