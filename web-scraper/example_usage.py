#!/usr/bin/env python3
"""
Example usage of the Toponymy Scraper
Demonstrates how to search for bridges and other features where help is requested
"""

from toponymy_scraper import ToponymyScraper


def example_single_entry():
    """Example: Check a single entry"""
    print("=" * 60)
    print("Example 1: Checking a single entry")
    print("=" * 60)

    scraper = ToponymyScraper(use_selenium=False)

    # Check the example bridge from the URL provided
    entry = scraper.scrape_entry(143574)

    if entry:
        print("\n✓ Found a help request!")
        print(f"  Name: {entry.get('name', 'N/A')}")
        print(f"  Type: {entry.get('type', 'N/A')}")
        print(f"  Location: {entry.get('location', 'N/A')}")
        print(f"  URL: {entry['url']}")
        print(f"\n  Help request text:")
        print(f"  {entry.get('help_request_text', 'N/A')[:200]}...")
    else:
        print("\n✗ No help request found at this entry")

    scraper.close()


def example_range_search():
    """Example: Search a range for help requests"""
    print("\n" + "=" * 60)
    print("Example 2: Searching a range of entries")
    print("=" * 60)

    scraper = ToponymyScraper(use_selenium=False)

    # Search around the example entry
    print("\nSearching entries 143570 to 143580...")
    results = scraper.scrape_range(143570, 143580, delay=1.5)

    print(f"\nFound {len(results)} entries with help requests:")
    for entry in results:
        print(f"  - {entry.get('name', 'N/A')} (seq={entry['no_seq']})")
        print(f"    Type: {entry.get('type', 'N/A')}")
        print(f"    Location: {entry.get('location', 'N/A')}")

    if results:
        # Save results
        scraper.save_to_csv(results, "example_results.csv")
        scraper.save_to_json(results, "example_results.json")
        print(f"\nResults saved to example_results.csv and example_results.json")

    scraper.close()


def example_custom_search():
    """Example: Custom search with filtering"""
    print("\n" + "=" * 60)
    print("Example 3: Custom search for bridges specifically")
    print("=" * 60)

    scraper = ToponymyScraper(use_selenium=False)

    results = scraper.scrape_range(143000, 143100, delay=1.0)

    # Filter for bridges only
    bridges = [
        entry for entry in results
        if entry.get('type', '').lower() in ['pont', 'bridge', 'viaduc']
    ]

    print(f"\nFound {len(bridges)} bridges with help requests:")
    for bridge in bridges:
        print(f"  - {bridge.get('name', 'N/A')} (seq={bridge['no_seq']})")
        print(f"    Location: {bridge.get('location', 'N/A')}")

    if bridges:
        scraper.save_to_csv(bridges, "bridges_needing_help.csv")
        print(f"\nBridge results saved to bridges_needing_help.csv")

    scraper.close()


def example_with_selenium():
    """Example: Using Selenium for better reliability"""
    print("\n" + "=" * 60)
    print("Example 4: Using Selenium (slower but more reliable)")
    print("=" * 60)

    print("\nNote: This requires Chrome/Chromium to be installed")
    print("It will download chromedriver automatically if needed\n")

    scraper = ToponymyScraper(use_selenium=True)

    # Check a single entry with Selenium
    entry = scraper.scrape_entry(143574)

    if entry:
        print("✓ Successfully scraped with Selenium!")
        print(f"  Name: {entry.get('name', 'N/A')}")
    else:
        print("✗ No help request found")

    scraper.close()


if __name__ == '__main__':
    import sys

    print("Toponymy Scraper - Example Usage")
    print("=" * 60)
    print("\nThis script demonstrates different ways to use the scraper")
    print("to find toponymic entries where the Quebec government")
    print("is requesting public help.\n")

    examples = {
        '1': ('Check single entry', example_single_entry),
        '2': ('Search a range', example_range_search),
        '3': ('Custom search (bridges)', example_custom_search),
        '4': ('Use Selenium', example_with_selenium),
        'all': ('Run all examples', None)
    }

    if len(sys.argv) > 1:
        choice = sys.argv[1]
    else:
        print("Available examples:")
        for key, (desc, _) in examples.items():
            if key != 'all':
                print(f"  {key}. {desc}")
        print(f"  all. Run all examples")
        print("\nUsage: python example_usage.py [1|2|3|4|all]")
        print("Or run without arguments to see this menu\n")
        choice = input("Enter your choice (or press Enter for example 1): ").strip() or '1'

    if choice == 'all':
        for key, (_, func) in examples.items():
            if func:
                func()
    elif choice in examples and examples[choice][1]:
        examples[choice][1]()
    else:
        print(f"Invalid choice: {choice}")
        sys.exit(1)

    print("\n" + "=" * 60)
    print("Examples completed!")
    print("=" * 60)
