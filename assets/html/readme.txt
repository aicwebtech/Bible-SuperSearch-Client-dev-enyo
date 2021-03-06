Bible SuperSearch Client (Generic Edition)
Copyright (C) 2006-2019  Luke Mounsey

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 3
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License (GPL)
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.

This SOFTWARE is made available FREE of charge, and is licensed for NON-COMMERCIAL use only.

    Matthew 10:8 freely ye have received, freely give. - Jesus

Commercial use will require a commercial license.  Commercial use includes:

* Putting the SOFTWARE behind a paywall
* Charging others to access or use the SOFTWARE
* Selling the SOFTWARE for any amount, whether by itself or bundled with other software.  This includes charging for shipping, handling or installation.
* Using the SOFTWARE as a gift to solicit donations.
* Incorporating into third party software which is NOT compatible with the GNU GPL. See [GNU License Compatibility](https://www.gnu.org/licenses/license-list.html#GPLCompatibleLicenses)
* Any other use which would violate the GNU GPL

Please see full license at https://www.biblesupersearch.com/license/

OVERVIEW
This is the official user interface client for the Bible SuperSearch API.

By installing and using this software, you agree to the API Terms of Service: https://api.biblesupersearch.com/documentation#tab_tos.
API Privacy Policy: https://api.biblesupersearch.com/documentation#tab_privacy
API full documentation: https://api.biblesupersearch.com/documentation

Alternatively, you can install the Bible SuperSearch API on your website.

REQUIREMENTS
1. A functioning website
2. Web host must have access to outside APIs.
3. Does NOT require PHP or database

INSTALLATION
1. Copy the 'biblesupersearch' directory (THIS directory) to somewhere on your website 
    It MUST be above the webroot, and visible to outside users
2. Rename config-example.js to config.js
3. Edit the configs in config.js
4. Load the demo page at yourdomain.com/path/to/biblesupersearch/index.html.  You should see the software working.
5. Incorporate Bible SuperSearch into your website. (See example.html)
    
    On the page that you would like to have Bible SuperSearch:   
    a.  Add these lines to your <head>, inserting the CORRECT path to the biblesupersearch directory:
        <link rel="stylesheet" href="/path/to/biblesupersearch/biblesupersearch.css">
        <script src="/path/to/biblesupersearch/config.js"></script>
        <script src="/path/to/biblesupersearch/biblesupersearch.js"></script>
    
    b.  Add these lines to your <body>:
        <div id='biblesupersearch_container'>
            <noscript class='biblesupersearch_noscript'>Please enable JavaScript to use</noscript>
        </div>

6. Load the page.  It should be working.

(Alternately, you can point to yourdomain.com/path/to/biblesupersearch/biblesupersearch.html instead of integrating it into your website.)

This client is built with the Enyo JavaScript framework, and the JavaScript code is minified.
The unminified development code can be seen here: https://sourceforge.net/p/biblesuper/ui-d/ci/master/tree/
