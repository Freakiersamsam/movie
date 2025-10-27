# Guide de Démarrage Rapide

## Installation en 3 étapes

### 1. Setup
```bash
cd web-scraper
bash setup.sh
```

### 2. Activer l'environnement virtuel
```bash
source venv/bin/activate
```

### 3. Lancer le scraper
```bash
python toponymy_scraper.py --start 143574 --end 143600
```

## Commandes Essentielles

### Scraper une plage spécifique
```bash
python toponymy_scraper.py --start 143000 --end 143100
```

### Avec un délai plus long (recommandé)
```bash
python toponymy_scraper.py --start 143000 --end 143100 --delay 2.0
```

### Utiliser Selenium (si bloqué)
```bash
python toponymy_scraper.py --start 143574 --end 143600 --selenium
```

### Voir les exemples
```bash
python example_usage.py
```

## Résultats

Les fichiers générés :
- `toponymy_help_requests.csv` - Format tableur
- `toponymy_help_requests.json` - Format structuré

## Que recherche ce scraper ?

Le scraper identifie les pages où la Commission de toponymie demande de l'aide avec ce texte :

> "La Commission de toponymie invite toute personne détenant une information sur l'un ou l'autre de ces aspects à lui en faire part."

## Exemple de Résultat

```csv
url,no_seq,name,type,location,help_request_text,found_help_request
https://toponymie.gouv.qc.ca/ct/ToposWeb/fiche.aspx?no_seq=143574,143574,Pont Exemple,Pont,Québec,"La Commission...",true
```

## Conseils

1. **Commencez petit** : Testez avec une petite plage (10-20 entrées)
2. **Soyez patient** : Utilisez un délai de 1-2 secondes minimum
3. **Vérifiez les résultats** : Ouvrez les fichiers CSV pour voir ce qui a été trouvé

## Problèmes Courants

### Erreur 403
- Augmentez le délai : `--delay 2.0`
- Essayez Selenium : `--selenium`

### Aucun résultat
- Vérifiez que la plage de numéros contient des entrées valides
- Testez avec l'exemple connu : 143574

### ImportError
- Réinstallez : `pip install -r requirements.txt`

## Support

Consultez le README.md pour plus de détails.
