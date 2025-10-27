#!/usr/bin/env python3
"""
Scraper for Quebec Toponymy Database
Finds entries where the government is requesting public help/information
"""

import csv
import json
import re
import time
from typing import List, Dict, Optional
from urllib.parse import urljoin, urlparse, parse_qs

import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager


class ToponymyScraper:
    """Scraper for Quebec Government Toponymy Database"""

    BASE_URL = "https://toponymie.gouv.qc.ca"
    SEARCH_TEXT = "La Commission de toponymie invite toute personne détenant une information"

    def __init__(self, use_selenium: bool = False):
        """
        Initialize the scraper

        Args:
            use_selenium: If True, use Selenium for JavaScript-heavy pages
        """
        self.use_selenium = use_selenium
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'fr-CA,fr;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        })
        self.driver = None

    def init_selenium(self):
        """Initialize Selenium WebDriver"""
        if self.driver is None:
            chrome_options = Options()
            chrome_options.add_argument('--headless')
            chrome_options.add_argument('--no-sandbox')
            chrome_options.add_argument('--disable-dev-shm-usage')
            chrome_options.add_argument('--disable-blink-features=AutomationControlled')
            chrome_options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

            self.driver = webdriver.Chrome(
                service=Service(ChromeDriverManager().install()),
                options=chrome_options
            )

    def close(self):
        """Close resources"""
        if self.driver:
            self.driver.quit()

    def fetch_page(self, url: str) -> Optional[str]:
        """
        Fetch a page using either requests or Selenium

        Args:
            url: URL to fetch

        Returns:
            HTML content or None if failed
        """
        if self.use_selenium:
            try:
                self.init_selenium()
                self.driver.get(url)
                time.sleep(2)  # Wait for page to load
                return self.driver.page_source
            except Exception as e:
                print(f"Error fetching {url} with Selenium: {e}")
                return None
        else:
            try:
                response = self.session.get(url, timeout=30)
                response.raise_for_status()
                return response.text
            except Exception as e:
                print(f"Error fetching {url} with requests: {e}")
                return None

    def parse_entry(self, html: str, url: str) -> Optional[Dict]:
        """
        Parse a toponymy entry page

        Args:
            html: HTML content
            url: Page URL

        Returns:
            Dictionary with entry data or None
        """
        soup = BeautifulSoup(html, 'lxml')

        # Check if page contains the help request text
        page_text = soup.get_text()
        if self.SEARCH_TEXT.lower() not in page_text.lower():
            return None

        # Extract entry data
        entry = {
            'url': url,
            'found_help_request': True
        }

        # Extract sequence number from URL
        parsed_url = urlparse(url)
        query_params = parse_qs(parsed_url.query)
        entry['no_seq'] = query_params.get('no_seq', [''])[0]

        # Try to extract name
        title_elem = soup.find('h1') or soup.find('h2')
        if title_elem:
            entry['name'] = title_elem.get_text(strip=True)

        # Extract type (pont, rivière, etc.)
        type_labels = soup.find_all(text=re.compile(r'Type|Catégorie|Entité', re.I))
        for label in type_labels:
            parent = label.find_parent()
            if parent:
                next_elem = parent.find_next_sibling()
                if next_elem:
                    entry['type'] = next_elem.get_text(strip=True)
                    break

        # Extract municipality/location
        location_keywords = ['Municipalité', 'Ville', 'Région']
        for keyword in location_keywords:
            location_elem = soup.find(text=re.compile(keyword, re.I))
            if location_elem:
                parent = location_elem.find_parent()
                if parent:
                    next_elem = parent.find_next_sibling()
                    if next_elem:
                        entry['location'] = next_elem.get_text(strip=True)
                        break

        # Extract the full context of the help request
        help_request_elem = soup.find(text=re.compile(self.SEARCH_TEXT, re.I))
        if help_request_elem:
            parent = help_request_elem.find_parent()
            if parent:
                entry['help_request_text'] = parent.get_text(strip=True)

        return entry

    def scrape_entry(self, no_seq: int) -> Optional[Dict]:
        """
        Scrape a single entry by sequence number

        Args:
            no_seq: Sequence number

        Returns:
            Entry data or None
        """
        url = f"{self.BASE_URL}/ct/ToposWeb/fiche.aspx?no_seq={no_seq}"
        print(f"Scraping: {url}")

        html = self.fetch_page(url)
        if not html:
            return None

        return self.parse_entry(html, url)

    def scrape_range(self, start: int, end: int, delay: float = 1.0) -> List[Dict]:
        """
        Scrape a range of entries

        Args:
            start: Starting sequence number
            end: Ending sequence number
            delay: Delay between requests in seconds

        Returns:
            List of entries with help requests
        """
        results = []

        for no_seq in range(start, end + 1):
            entry = self.scrape_entry(no_seq)
            if entry:
                results.append(entry)
                print(f"✓ Found help request at no_seq={no_seq}")

            time.sleep(delay)

        return results

    def save_to_csv(self, entries: List[Dict], filename: str = "toponymy_help_requests.csv"):
        """Save entries to CSV file"""
        if not entries:
            print("No entries to save")
            return

        keys = entries[0].keys()
        with open(filename, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=keys)
            writer.writeheader()
            writer.writerows(entries)

        print(f"Saved {len(entries)} entries to {filename}")

    def save_to_json(self, entries: List[Dict], filename: str = "toponymy_help_requests.json"):
        """Save entries to JSON file"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(entries, f, ensure_ascii=False, indent=2)

        print(f"Saved {len(entries)} entries to {filename}")


def main():
    """Main execution function"""
    import argparse

    parser = argparse.ArgumentParser(
        description='Scrape Quebec Toponymy Database for help requests'
    )
    parser.add_argument(
        '--start',
        type=int,
        default=143574,
        help='Starting sequence number (default: 143574)'
    )
    parser.add_argument(
        '--end',
        type=int,
        default=143584,
        help='Ending sequence number (default: 143584)'
    )
    parser.add_argument(
        '--delay',
        type=float,
        default=1.0,
        help='Delay between requests in seconds (default: 1.0)'
    )
    parser.add_argument(
        '--selenium',
        action='store_true',
        help='Use Selenium instead of requests'
    )
    parser.add_argument(
        '--output',
        type=str,
        default='toponymy_help_requests',
        help='Output filename prefix (default: toponymy_help_requests)'
    )

    args = parser.parse_args()

    print(f"Starting scraper (seq {args.start} to {args.end})...")
    print(f"Using {'Selenium' if args.selenium else 'requests'}")

    scraper = ToponymyScraper(use_selenium=args.selenium)

    try:
        results = scraper.scrape_range(args.start, args.end, args.delay)

        if results:
            scraper.save_to_csv(results, f"{args.output}.csv")
            scraper.save_to_json(results, f"{args.output}.json")

            print(f"\nFound {len(results)} entries with help requests:")
            for entry in results:
                print(f"  - {entry.get('name', 'N/A')} (seq={entry['no_seq']})")
        else:
            print("No entries with help requests found in the specified range")

    finally:
        scraper.close()


if __name__ == '__main__':
    main()
