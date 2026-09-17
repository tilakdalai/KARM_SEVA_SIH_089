"""
Pan-India Location Directory & Geocodes for KARM SEVA
Covers all 28 States and 8 Union Territories with standard ISO codes, centers, and district lists.
"""

INDIAN_STATES_DATA = {
    "AP": {
        "name": "Andhra Pradesh",
        "type": "STATE",
        "center_lat": 15.9129,
        "center_lng": 79.7400,
        "districts": [
            "Alluri Sitharama Raju", "Anakapalli", "Ananthapuramu", "Annamayya", "Bapatla",
            "Chittoor", "Dr. B.R. Ambedkar Konaseema", "East Godavari", "Eluru", "Guntur",
            "Kakinada", "Krishna", "Kurnool", "Nandyal", "NTR", "Palnadu",
            "Parvathipuram Manyam", "Prakasam", "Sri Potti Sriramulu Nellore", "Sri Sathya Sai",
            "Srikakulam", "Tirupati", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"
        ],
    },
    "DL": {
        "name": "Delhi (NCT)",
        "type": "UNION_TERRITORY",
        "center_lat": 28.7041,
        "center_lng": 77.1025,
        "districts": [
            "Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi",
            "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"
        ],
    },
    "GJ": {
        "name": "Gujarat",
        "type": "STATE",
        "center_lat": 22.2587,
        "center_lng": 71.1924,
        "districts": [
            "Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar",
            "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar",
            "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana",
            "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot",
            "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"
        ],
    },
    "KA": {
        "name": "Karnataka",
        "type": "STATE",
        "center_lat": 15.3173,
        "center_lng": 75.7139,
        "districts": [
            "Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar",
            "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada (Mangaluru)",
            "Davanagere", "Dharwad (Hubballi)", "Gadag", "Hassan", "Haveri", "Kalaburagi",
            "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara",
            "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayanagara", "Vijayapura", "Yadgir"
        ],
    },
    "MH": {
        "name": "Maharashtra",
        "type": "STATE",
        "center_lat": 19.7515,
        "center_lng": 75.7139,
        "districts": [
            "Ahmednagar", "Akola", "Amravati", "Aurangabad (Chhatrapati Sambhajinagar)", "Beed",
            "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli",
            "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur",
            "Nanded", "Nandurbar", "Nashik", "Osmanabad (Dharashiv)", "Palghar", "Parbhani",
            "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur",
            "Thane", "Wardha", "Washim", "Yavatmal"
        ],
    },
    "OD": {
        "name": "Odisha",
        "type": "STATE",
        "center_lat": 20.9517,
        "center_lng": 85.0985,
        "districts": [
            "Angul", "Balangir", "Balasore (Baleswar)", "Bargarh", "Bhadrak", "Boudh",
            "Cuttack", "Deogarh", "Dhenkanal", "Gajapati", "Ganjam (Berhampur)", "Jagatsinghpur",
            "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar (Keonjhar)",
            "Khordha (Bhubaneswar)", "Koraput", "Malkangiri", "Mayurbhanj (Baripada)", "Nabarangpur",
            "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Subarnapur (Sonepur)", "Sundargarh (Rourkela)"
        ],
    },
    "RJ": {
        "name": "Rajasthan",
        "type": "STATE",
        "center_lat": 27.0238,
        "center_lng": 74.2179,
        "districts": [
            "Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner",
            "Chittorgarh", "Churu", "Dausa", "Dholpur", "Hanumangarh", "Jaipur", "Jaisalmer",
            "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur",
            "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"
        ],
    },
    "TN": {
        "name": "Tamil Nadu",
        "type": "STATE",
        "center_lat": 11.1271,
        "center_lng": 78.6569,
        "districts": [
            "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri",
            "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari (Nagercoil)",
            "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal",
            "Nilgiris (Ooty)", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet",
            "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli",
            "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur",
            "Vellore", "Viluppuram", "Virudhunagar"
        ],
    },
    "TG": {
        "name": "Telangana",
        "type": "STATE",
        "center_lat": 18.1124,
        "center_lng": 79.0193,
        "districts": [
            "Adilabad", "Bhadradri Kothagudem", "Hanumakonda", "Hyderabad", "Jagtial",
            "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar",
            "Khammam", "Kumuram Bheem Asifabad", "Mahabubabad", "Mahabubnagar", "Mancherial",
            "Medak", "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet",
            "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Rangareddy", "Sangareddy",
            "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal", "Yadadri Bhuvanagiri"
        ],
    },
    "UP": {
        "name": "Uttar Pradesh",
        "type": "STATE",
        "center_lat": 26.8467,
        "center_lng": 80.9462,
        "districts": [
            "Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya (Faizabad)",
            "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki",
            "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli",
            "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad",
            "Gautam Buddha Nagar (Noida)", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur",
            "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj",
            "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri (Lakhimpur)", "Kushinagar",
            "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau",
            "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh",
            "Prayagraj (Allahabad)", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar",
            "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"
        ],
    },
    "WB": {
        "name": "West Bengal",
        "type": "STATE",
        "center_lat": 22.9868,
        "center_lng": 87.8550,
        "districts": [
            "Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling",
            "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda",
            "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman (Durgapur/Asansol)",
            "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"
        ],
    },
}

def get_all_state_names():
    return [s["name"] for s in INDIAN_STATES_DATA.values()]

def get_districts_by_state(state_query: str):
    q = state_query.strip().lower()
    for code, info in INDIAN_STATES_DATA.items():
        if code.lower() == q or info["name"].lower() == q:
            return info["districts"]
    return []
