# ads.txt - Guide Complet

## ✅ Qu'est-ce que ads.txt?

Le fichier **ads.txt** (Authorized Digital Sellers) est un fichier texte qui autorise quels réseaux publicitaires peuvent vendre des annonces sur votre site.

**Requis pour:** Google AdSense, Google Ad Manager, et tous les autres réseaux publicitaires.

---

## 📄 Contenu du fichier

```
google.com, pub-8052290720138654, DIRECT, f08c47fec0942fa0
```

### Explication:
- **google.com** - Le domaine du réseau publicitaire (Google)
- **pub-8052290720138654** - Votre Publisher ID AdSense
- **DIRECT** - Relation directe (vous avez un compte direct avec Google)
- **f08c47fec0942fa0** - ID de certification Google (standard)

---

## 🔍 Vérifier que ça fonctionne

### Méthode 1: Browser
1. Visitez: https://cinemdle.com/ads.txt
2. Vous devriez voir: `google.com, pub-8052290720138654, DIRECT, f08c47fec0942fa0`

### Méthode 2: Curl
```bash
curl https://cinemdle.com/ads.txt
```

### Méthode 3: Google AdSense Dashboard
1. Allez sur [adsense.google.com](https://adsense.google.com)
2. Cliquez **"Sites"**
3. Cherchez cinemdle.com
4. Vérifiez le statut ads.txt:
   - ✅ "ads.txt file found" = BON
   - ❌ "ads.txt file not found" = PROBLÈME

---

## ⚠️ Problèmes courants

### ads.txt retourne 404
**Cause:** Le fichier n'est pas à la racine du domaine

**Solution:**
- Le fichier DOIT être à: `https://cinemdle.com/ads.txt`
- PAS à: `https://cinemdle.com/movie/ads.txt`
- Vérifiez que GitHub Pages sert le fichier correctement

### AdSense dit "ads.txt issues"
**Attendre 24-48 heures** pour que Google crawle le fichier.

### Mauvais Publisher ID
**Vérifiez dans AdSense:**
1. AdSense → Account → Settings
2. Cherchez "Publisher ID"
3. Doit être: `pub-8052290720138654`

---

## 🔧 Ajouter d'autres réseaux publicitaires

Si vous utilisez d'autres réseaux en plus d'AdSense:

```
# Google AdSense
google.com, pub-8052290720138654, DIRECT, f08c47fec0942fa0

# Autre réseau (exemple)
# revcontent.com, pub-XXXXX, DIRECT, xxx
```

**Note:** Chaque ligne = un réseau autorisé

---

## ✅ Checklist

- [x] Fichier ads.txt créé
- [x] Contenu correct avec votre Publisher ID
- [x] Déployé à la racine (cinemdle.com/ads.txt)
- [ ] Vérifié accessible dans le navigateur
- [ ] Attendu 24-48h pour que Google le crawle
- [ ] Vérifié dans AdSense dashboard

---

## 📊 Impact

### Avec ads.txt:
- ✅ AdSense approuvé plus facilement
- ✅ Protège contre fraude publicitaire
- ✅ Meilleurs revenus (ad networks savent que c'est légitime)
- ✅ Requis pour monétisation

### Sans ads.txt:
- ❌ AdSense peut refuser ou limiter les ads
- ❌ Revenus potentiellement plus bas
- ❌ Risque de fraude publicitaire
- ❌ Non-compliance avec IAB standards

---

## 🚀 Prochaines étapes

1. **Attendre 5 minutes** pour déploiement
2. **Vérifier:** https://cinemdle.com/ads.txt
3. **Dans 24-48h:** Google crawlera le fichier
4. **Puis:** Soumettre site à AdSense
5. **Attendre approbation:** 1-2 semaines

---

## 📞 Ressources

- [IAB ads.txt Spec](https://iabtechlab.com/ads-txt/)
- [Google AdSense ads.txt Guide](https://support.google.com/adsense/answer/7532444)
- [ads.txt Validator](https://adstxt.guru/)

---

**Votre ads.txt est maintenant configuré correctement!** ✅
