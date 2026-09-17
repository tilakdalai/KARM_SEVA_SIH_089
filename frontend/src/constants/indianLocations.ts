export interface DistrictInfo {
  name: string;
  code?: string;
  headquarters?: string;
  lat?: number;
  lng?: number;
}

export interface StateOrUT {
  name: string;
  code: string; // ISO 3166-2:IN code suffix e.g. "DL", "MH", "KA", "OD"
  type: 'STATE' | 'UNION_TERRITORY';
  centerLat: number;
  centerLng: number;
  defaultZoom: number;
  districts: string[];
}

export interface AddressLocation {
  country: string;
  state: string;
  stateCode: string;
  district: string;
  city?: string;
  locality?: string;
  pincode: string;
  addressLine: string;
  landmark?: string;
  lat?: number;
  lng?: number;
}

export const COUNTRY_INDIA = {
  name: 'India',
  code: 'IN',
  dialCode: '+91',
  centerLat: 20.5937,
  centerLng: 78.9629,
  defaultZoom: 5,
};

export const INDIAN_STATES_AND_UTS: StateOrUT[] = [
  {
    name: 'Andhra Pradesh',
    code: 'AP',
    type: 'STATE',
    centerLat: 15.9129,
    centerLng: 79.74,
    defaultZoom: 7,
    districts: [
      'Alluri Sitharama Raju', 'Anakapalli', 'Ananthapuramu', 'Annamayya', 'Bapatla',
      'Chittoor', 'Dr. B.R. Ambedkar Konaseema', 'East Godavari', 'Eluru', 'Guntur',
      'Kakinada', 'Krishna', 'Kurnool', 'Nandyal', 'NTR', 'Palnadu',
      'Parvathipuram Manyam', 'Prakasam', 'Sri Potti Sriramulu Nellore', 'Sri Sathya Sai',
      'Srikakulam', 'Tirupati', 'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'YSR Kadapa'
    ],
  },
  {
    name: 'Arunachal Pradesh',
    code: 'AR',
    type: 'STATE',
    centerLat: 28.218,
    centerLng: 94.7278,
    defaultZoom: 7,
    districts: [
      'Anjaw', 'Changlang', 'Dibang Valley', 'East Kameng', 'East Siang', 'Kamle',
      'Kra Daadi', 'Kurung Kumey', 'Lepa Rada', 'Lohit', 'Longding', 'Lower Dibang Valley',
      'Lower Siang', 'Lower Subansiri', 'Namsai', 'Pakke Kessang', 'Papum Pare', 'Shi Yomi',
      'Siang', 'Tawang', 'Tirap', 'Upper Siang', 'Upper Subansiri', 'West Kameng', 'West Siang'
    ],
  },
  {
    name: 'Assam',
    code: 'AS',
    type: 'STATE',
    centerLat: 26.2006,
    centerLng: 92.9376,
    defaultZoom: 7,
    districts: [
      'Baksa', 'Barpeta', 'Biswanath', 'Bongaigaon', 'Cachar', 'Charaideo', 'Chirang',
      'Darrang', 'Dhemaji', 'Dhubri', 'Dibrugarh', 'Dima Hasao', 'Goalpara', 'Golaghat',
      'Hailakandi', 'Hojai', 'Jorhat', 'Kamrup', 'Kamrup Metropolitan (Guwahati)', 'Karbi Anglong',
      'Karimganj', 'Kokrajhar', 'Lakhimpur', 'Majuli', 'Morigaon', 'Nagaon', 'Nalbari',
      'Sivasagar', 'Sonitpur', 'South Salmara-Mankachar', 'Tinsukia', 'Udalguri', 'West Karbi Anglong'
    ],
  },
  {
    name: 'Bihar',
    code: 'BR',
    type: 'STATE',
    centerLat: 25.0961,
    centerLng: 85.3131,
    defaultZoom: 7,
    districts: [
      'Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur', 'Buxar',
      'Darbhanga', 'East Champaran', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad', 'Kaimur',
      'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura', 'Madhubani', 'Munger',
      'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 'Purnia', 'Rohtas', 'Saharsa', 'Samastipur',
      'Saran', 'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul', 'Vaishali', 'West Champaran'
    ],
  },
  {
    name: 'Chhattisgarh',
    code: 'CG',
    type: 'STATE',
    centerLat: 21.2787,
    centerLng: 81.8661,
    defaultZoom: 7,
    districts: [
      'Balod', 'Baloda Bazar', 'Balrampur', 'Bastar', 'Bemetara', 'Bijapur', 'Bilaspur',
      'Dantewada', 'Dhamtari', 'Durg', 'Gariaband', 'Gaurela-Pendra-Marwahi', 'Janjgir-Champa',
      'Jashpur', 'Kabirdham', 'Kanker', 'Kondagaon', 'Korba', 'Koriya', 'Mahasamund',
      'Manendragarh-Chirmiri-Bharatpur', 'Mohla-Manpur-Ambagarh Chowki', 'Mungeli', 'Narayanpur',
      'Raigarh', 'Raipur', 'Rajnandgaon', 'Sarangarh-Bilaigarh', 'Sakti', 'Sukma', 'Surajpur', 'Surguja'
    ],
  },
  {
    name: 'Delhi (NCT)',
    code: 'DL',
    type: 'UNION_TERRITORY',
    centerLat: 28.7041,
    centerLng: 77.1025,
    defaultZoom: 11,
    districts: [
      'Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi',
      'North West Delhi', 'Shahdara', 'South Delhi', 'South East Delhi', 'South West Delhi', 'West Delhi'
    ],
  },
  {
    name: 'Goa',
    code: 'GA',
    type: 'STATE',
    centerLat: 15.2993,
    centerLng: 74.124,
    defaultZoom: 9,
    districts: ['North Goa (Panaji)', 'South Goa (Margao)'],
  },
  {
    name: 'Gujarat',
    code: 'GJ',
    type: 'STATE',
    centerLat: 22.2587,
    centerLng: 71.1924,
    defaultZoom: 7,
    districts: [
      'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch', 'Bhavnagar',
      'Botad', 'Chhota Udaipur', 'Dahod', 'Dang', 'Devbhoomi Dwarka', 'Gandhinagar',
      'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kheda', 'Kutch', 'Mahisagar', 'Mehsana',
      'Morbi', 'Narmada', 'Navsari', 'Panchmahal', 'Patan', 'Porbandar', 'Rajkot',
      'Sabarkantha', 'Surat', 'Surendranagar', 'Tapi', 'Vadodara', 'Valsad'
    ],
  },
  {
    name: 'Haryana',
    code: 'HR',
    type: 'STATE',
    centerLat: 29.0588,
    centerLng: 76.0856,
    defaultZoom: 7,
    districts: [
      'Ambala', 'Bhiwani', 'Charkhi Dadri', 'Faridabad', 'Fatehabad', 'Gurugram',
      'Hisar', 'Jhajjar', 'Jind', 'Kaithal', 'Karnal', 'Kurukshetra', 'Mahendragarh',
      'Nuh', 'Palwal', 'Panchkula', 'Panipat', 'Rewari', 'Rohtak', 'Sirsa', 'Sonipat', 'Yamunanagar'
    ],
  },
  {
    name: 'Himachal Pradesh',
    code: 'HP',
    type: 'STATE',
    centerLat: 31.1048,
    centerLng: 77.1734,
    defaultZoom: 7,
    districts: [
      'Bilaspur', 'Chamba', 'Hamirpur', 'Kangra', 'Kinnaur', 'Kullu',
      'Lahaul and Spiti', 'Mandi', 'Shimla', 'Sirmaur', 'Solan', 'Una'
    ],
  },
  {
    name: 'Jammu and Kashmir',
    code: 'JK',
    type: 'UNION_TERRITORY',
    centerLat: 33.7782,
    centerLng: 76.5762,
    defaultZoom: 7,
    districts: [
      'Anantnag', 'Bandipora', 'Baramulla', 'Budgam', 'Doda', 'Ganderbal', 'Jammu',
      'Kathua', 'Kishtwar', 'Kulgam', 'Kupwara', 'Poonch', 'Pulwama', 'Rajouri',
      'Ramban', 'Reasi', 'Samba', 'Shopian', 'Srinagar', 'Udhampur'
    ],
  },
  {
    name: 'Jharkhand',
    code: 'JH',
    type: 'STATE',
    centerLat: 23.6102,
    centerLng: 85.2799,
    defaultZoom: 7,
    districts: [
      'Bokaro', 'Chatra', 'Deoghar', 'Dhanbad', 'Dumka', 'East Singhbhum (Jamshedpur)',
      'Garhwa', 'Giridih', 'Godda', 'Gumla', 'Hazaribagh', 'Jamtara', 'Khunti',
      'Koderma', 'Latehar', 'Lohardaga', 'Pakur', 'Palamu', 'Ramgarh', 'Ranchi',
      'Sahebganj', 'Seraikela Kharsawan', 'Simdega', 'West Singhbhum'
    ],
  },
  {
    name: 'Karnataka',
    code: 'KA',
    type: 'STATE',
    centerLat: 15.3173,
    centerLng: 75.7139,
    defaultZoom: 7,
    districts: [
      'Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban', 'Bidar',
      'Chamarajanagar', 'Chikkaballapur', 'Chikkamagaluru', 'Chitradurga', 'Dakshina Kannada (Mangaluru)',
      'Davanagere', 'Dharwad (Hubballi)', 'Gadag', 'Hassan', 'Haveri', 'Kalaburagi',
      'Kodagu', 'Kolar', 'Koppal', 'Mandya', 'Mysuru', 'Raichur', 'Ramanagara',
      'Shivamogga', 'Tumakuru', 'Udupi', 'Uttara Kannada', 'Vijayanagara', 'Vijayapura', 'Yadgir'
    ],
  },
  {
    name: 'Kerala',
    code: 'KL',
    type: 'STATE',
    centerLat: 10.8505,
    centerLng: 76.2711,
    defaultZoom: 7,
    districts: [
      'Alappuzha', 'Ernakulam (Kochi)', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam',
      'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad', 'Pathanamthitta',
      'Thiruvananthapuram', 'Thrissur', 'Wayanad'
    ],
  },
  {
    name: 'Ladakh',
    code: 'LA',
    type: 'UNION_TERRITORY',
    centerLat: 34.1526,
    centerLng: 77.5771,
    defaultZoom: 7,
    districts: ['Kargil', 'Leh'],
  },
  {
    name: 'Madhya Pradesh',
    code: 'MP',
    type: 'STATE',
    centerLat: 22.9734,
    centerLng: 78.6569,
    defaultZoom: 7,
    districts: [
      'Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashoknagar', 'Balaghat', 'Barwani', 'Betul',
      'Bhind', 'Bhopal', 'Burhanpur', 'Chhatarpur', 'Chhindwara', 'Damoh', 'Datia',
      'Dewas', 'Dhar', 'Dindori', 'Guna', 'Gwalior', 'Harda', 'Hoshangabad (Narmadapuram)',
      'Indore', 'Jabalpur', 'Jhabua', 'Katni', 'Khandwa', 'Khargone', 'Mandla', 'Mandsaur',
      'Morena', 'Narsinghpur', 'Neemuch', 'Niwari', 'Panna', 'Raisen', 'Rajgarh', 'Ratlam',
      'Rewa', 'Sagar', 'Satna', 'Sehore', 'Seoni', 'Shahdol', 'Shajapur', 'Sheopur',
      'Shivpuri', 'Sidhi', 'Singrauli', 'Tikamgarh', 'Ujjain', 'Umaria', 'Vidisha'
    ],
  },
  {
    name: 'Maharashtra',
    code: 'MH',
    type: 'STATE',
    centerLat: 19.7515,
    centerLng: 75.7139,
    defaultZoom: 7,
    districts: [
      'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad (Chhatrapati Sambhajinagar)', 'Beed',
      'Bhandara', 'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli',
      'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur',
      'Nanded', 'Nandurbar', 'Nashik', 'Osmanabad (Dharashiv)', 'Palghar', 'Parbhani',
      'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur',
      'Thane', 'Wardha', 'Washim', 'Yavatmal'
    ],
  },
  {
    name: 'Manipur',
    code: 'MN',
    type: 'STATE',
    centerLat: 24.6637,
    centerLng: 93.9063,
    defaultZoom: 8,
    districts: [
      'Bishnupur', 'Chandel', 'Churachandpur', 'Imphal East', 'Imphal West', 'Jiribam',
      'Kakching', 'Kamjong', 'Kangpokpi', 'Noney', 'Pherzawl', 'Senapati', 'Tamenglong',
      'Tengnoupal', 'Thoubal', 'Ukhrul'
    ],
  },
  {
    name: 'Meghalaya',
    code: 'ML',
    type: 'STATE',
    centerLat: 25.467,
    centerLng: 91.3662,
    defaultZoom: 8,
    districts: [
      'East Garo Hills', 'East Jaintia Hills', 'East Khasi Hills (Shillong)', 'Eastern West Khasi Hills',
      'North Garo Hills', 'Ri Bhoi', 'South Garo Hills', 'South West Garo Hills',
      'South West Khasi Hills', 'West Garo Hills', 'West Jaintia Hills', 'West Khasi Hills'
    ],
  },
  {
    name: 'Mizoram',
    code: 'MZ',
    type: 'STATE',
    centerLat: 23.1645,
    centerLng: 92.9376,
    defaultZoom: 8,
    districts: [
      'Aizawl', 'Champhai', 'Hnahthial', 'Khawzawl', 'Kolasib', 'Lawngtlai',
      'Lunglei', 'Mamit', 'Saitual', 'Serchhip', 'Siaha'
    ],
  },
  {
    name: 'Nagaland',
    code: 'NL',
    type: 'STATE',
    centerLat: 26.1584,
    centerLng: 94.5624,
    defaultZoom: 8,
    districts: [
      'Chümoukedima', 'Dimapur', 'Kiphire', 'Kohima', 'Longleng', 'Mokokchung',
      'Mon', 'Niuland', 'Noklak', 'Peren', 'Phek', 'Shamator', 'Tseminyü', 'Tuensang', 'Wokha', 'Zünheboto'
    ],
  },
  {
    name: 'Odisha',
    code: 'OD',
    type: 'STATE',
    centerLat: 20.9517,
    centerLng: 85.0985,
    defaultZoom: 7,
    districts: [
      'Angul', 'Balangir', 'Balasore (Baleswar)', 'Bargarh', 'Bhadrak', 'Boudh',
      'Cuttack', 'Deogarh', 'Dhenkanal', 'Gajapati', 'Ganjam (Berhampur)', 'Jagatsinghpur',
      'Jajpur', 'Jharsuguda', 'Kalahandi', 'Kandhamal', 'Kendrapara', 'Kendujhar (Keonjhar)',
      'Khordha (Bhubaneswar)', 'Koraput', 'Malkangiri', 'Mayurbhanj (Baripada)', 'Nabarangpur',
      'Nayagarh', 'Nuapada', 'Puri', 'Rayagada', 'Sambalpur', 'Subarnapur (Sonepur)', 'Sundargarh (Rourkela)'
    ],
  },
  {
    name: 'Punjab',
    code: 'PB',
    type: 'STATE',
    centerLat: 31.1471,
    centerLng: 75.3412,
    defaultZoom: 7,
    districts: [
      'Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib', 'Fazilka',
      'Ferozepur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Kapurthala', 'Ludhiana',
      'Malerkotla', 'Mansa', 'Moga', 'Mohali (SAS Nagar)', 'Muktsar', 'Pathankot',
      'Patiala', 'Rupnagar (Ropar)', 'Sangrur', 'Shaheed Bhagat Singh Nagar (Nawanshahr)', 'Tarn Taran'
    ],
  },
  {
    name: 'Rajasthan',
    code: 'RJ',
    type: 'STATE',
    centerLat: 27.0238,
    centerLng: 74.2179,
    defaultZoom: 6,
    districts: [
      'Ajmer', 'Alwar', 'Anupgarh', 'Balotra', 'Banswara', 'Baran', 'Barmer', 'Beawar',
      'Bharatpur', 'Bhilwara', 'Bikaner', 'Bundi', 'Chittorgarh', 'Churu', 'Dausa',
      'Deeg', 'Didwana-Kuchaman', 'Dholpur', 'Dudu', 'Gangapur City', 'Hanumangarh',
      'Jaipur', 'Jaipur Rural', 'Jaisalmer', 'Jalore', 'Jhalawar', 'Jhunjhunu', 'Jodhpur',
      'Jodhpur Rural', 'Karauli', 'Kekri', 'Khairthal-Tijara', 'Kota', 'Kotputli-Behror',
      'Nagaur', 'Neem Ka Thana', 'Pali', 'Phalodi', 'Pratapgarh', 'Rajsamand', 'Salumbar',
      'Sanchore', 'Sawai Madhopur', 'Shahpura', 'Sikar', 'Sirohi', 'Sri Ganganagar', 'Tonk', 'Udaipur'
    ],
  },
  {
    name: 'Sikkim',
    code: 'SK',
    type: 'STATE',
    centerLat: 27.533,
    centerLng: 88.5122,
    defaultZoom: 8,
    districts: ['Gangtok', 'Gyalshing', 'Mangan', 'Namchi', 'Pakyong', 'Soreng'],
  },
  {
    name: 'Tamil Nadu',
    code: 'TN',
    type: 'STATE',
    centerLat: 11.1271,
    centerLng: 78.6569,
    defaultZoom: 7,
    districts: [
      'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri',
      'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari (Nagercoil)',
      'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai', 'Nagapattinam', 'Namakkal',
      'Nilgiris (Ooty)', 'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet',
      'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli',
      'Tirunelveli', 'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur',
      'Vellore', 'Viluppuram', 'Virudhunagar'
    ],
  },
  {
    name: 'Telangana',
    code: 'TG',
    type: 'STATE',
    centerLat: 18.1124,
    centerLng: 79.0193,
    defaultZoom: 7,
    districts: [
      'Adilabad', 'Bhadradri Kothagudem', 'Hanumakonda', 'Hyderabad', 'Jagtial',
      'Jangaon', 'Jayashankar Bhupalpally', 'Jogulamba Gadwal', 'Kamareddy', 'Karimnagar',
      'Khammam', 'Kumuram Bheem Asifabad', 'Mahabubabad', 'Mahabubnagar', 'Mancherial',
      'Medak', 'Medchal-Malkajgiri', 'Mulugu', 'Nagarkurnool', 'Nalgonda', 'Narayanpet',
      'Nirmal', 'Nizamabad', 'Peddapalli', 'Rajanna Sircilla', 'Rangareddy', 'Sangareddy',
      'Siddipet', 'Suryapet', 'Vikarabad', 'Wanaparthy', 'Warangal', 'Yadadri Bhuvanagiri'
    ],
  },
  {
    name: 'Tripura',
    code: 'TR',
    type: 'STATE',
    centerLat: 23.9408,
    centerLng: 91.9882,
    defaultZoom: 8,
    districts: [
      'Dhalai', 'Gomati', 'Khowai', 'North Tripura', 'Sepahijala', 'South Tripura', 'Unakoti', 'West Tripura (Agartala)'
    ],
  },
  {
    name: 'Uttar Pradesh',
    code: 'UP',
    type: 'STATE',
    centerLat: 26.8467,
    centerLng: 80.9462,
    defaultZoom: 6,
    districts: [
      'Agra', 'Aligarh', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Ayodhya (Faizabad)',
      'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki',
      'Bareilly', 'Basti', 'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli',
      'Chitrakoot', 'Deoria', 'Etah', 'Etawah', 'Farrukhabad', 'Fatehpur', 'Firozabad',
      'Gautam Buddha Nagar (Noida)', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur',
      'Hamirpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj',
      'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kheri (Lakhimpur)', 'Kushinagar',
      'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura', 'Mau',
      'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh',
      'Prayagraj (Allahabad)', 'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar',
      'Shahjahanpur', 'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi'
    ],
  },
  {
    name: 'Uttarakhand',
    code: 'UK',
    type: 'STATE',
    centerLat: 30.0668,
    centerLng: 79.0193,
    defaultZoom: 7,
    districts: [
      'Almora', 'Bageshwar', 'Chamoli', 'Champawat', 'Dehradun', 'Haridwar',
      'Nainital', 'Pauri Garhwal', 'Pithoragarh', 'Rudraprayag', 'Tehri Garhwal',
      'Udham Singh Nagar', 'Uttarkashi'
    ],
  },
  {
    name: 'West Bengal',
    code: 'WB',
    type: 'STATE',
    centerLat: 22.9868,
    centerLng: 87.855,
    defaultZoom: 7,
    districts: [
      'Alipurduar', 'Bankura', 'Birbhum', 'Cooch Behar', 'Dakshin Dinajpur', 'Darjeeling',
      'Hooghly', 'Howrah', 'Jalpaiguri', 'Jhargram', 'Kalimpong', 'Kolkata', 'Malda',
      'Murshidabad', 'Nadia', 'North 24 Parganas', 'Paschim Bardhaman (Durgapur/Asansol)',
      'Paschim Medinipur', 'Purba Bardhaman', 'Purba Medinipur', 'Purulia', 'South 24 Parganas', 'Uttar Dinajpur'
    ],
  },
  {
    name: 'Andaman and Nicobar Islands',
    code: 'AN',
    type: 'UNION_TERRITORY',
    centerLat: 11.7401,
    centerLng: 92.6586,
    defaultZoom: 7,
    districts: ['Nicobar', 'North and Middle Andaman', 'South Andaman (Port Blair)'],
  },
  {
    name: 'Chandigarh',
    code: 'CH',
    type: 'UNION_TERRITORY',
    centerLat: 30.7333,
    centerLng: 76.7794,
    defaultZoom: 12,
    districts: ['Chandigarh'],
  },
  {
    name: 'Dadra and Nagar Haveli and Daman and Diu',
    code: 'DH',
    type: 'UNION_TERRITORY',
    centerLat: 20.1809,
    centerLng: 73.0169,
    defaultZoom: 8,
    districts: ['Dadra and Nagar Haveli (Silvassa)', 'Daman', 'Diu'],
  },
  {
    name: 'Lakshadweep',
    code: 'LD',
    type: 'UNION_TERRITORY',
    centerLat: 10.5667,
    centerLng: 72.6417,
    defaultZoom: 8,
    districts: ['Lakshadweep (Kavaratti)'],
  },
  {
    name: 'Puducherry',
    code: 'PY',
    type: 'UNION_TERRITORY',
    centerLat: 11.9416,
    centerLng: 79.8083,
    defaultZoom: 9,
    districts: ['Karaikal', 'Mahe', 'Puducherry', 'Yanam'],
  },
];

// Helper Functions
export const getAllStatesAndUTs = (): StateOrUT[] => INDIAN_STATES_AND_UTS;

export const getStateNames = (): string[] => INDIAN_STATES_AND_UTS.map((s) => s.name);

export const getStateByCodeOrName = (query: string): StateOrUT | undefined => {
  if (!query) return undefined;
  const q = query.trim().toLowerCase();
  return INDIAN_STATES_AND_UTS.find(
    (s) => s.code.toLowerCase() === q || s.name.toLowerCase() === q
  );
};

export const getDistrictsForState = (stateNameOrCode: string): string[] => {
  const state = getStateByCodeOrName(stateNameOrCode);
  return state ? state.districts : [];
};

export const getDefaultCoordinatesForLocation = (
  stateName?: string,
  districtName?: string
): { lat: number; lng: number; zoom: number } => {
  if (!stateName) {
    return {
      lat: COUNTRY_INDIA.centerLat,
      lng: COUNTRY_INDIA.centerLng,
      zoom: COUNTRY_INDIA.defaultZoom,
    };
  }
  const state = getStateByCodeOrName(stateName);
  if (!state) {
    return {
      lat: COUNTRY_INDIA.centerLat,
      lng: COUNTRY_INDIA.centerLng,
      zoom: COUNTRY_INDIA.defaultZoom,
    };
  }

  // Major metro district coordinates
  const districtMap: Record<string, { lat: number; lng: number; zoom: number }> = {
    'Mumbai City': { lat: 18.9388, lng: 72.8354, zoom: 12 },
    'Mumbai Suburban': { lat: 19.1136, lng: 72.8697, zoom: 12 },
    'Pune': { lat: 18.5204, lng: 73.8567, zoom: 12 },
    'Bengaluru Urban': { lat: 12.9716, lng: 77.5946, zoom: 12 },
    'Chennai': { lat: 13.0827, lng: 80.2707, zoom: 12 },
    'Hyderabad': { lat: 17.385, lng: 78.4867, zoom: 12 },
    'Kolkata': { lat: 22.5726, lng: 88.3639, zoom: 12 },
    'New Delhi': { lat: 28.6139, lng: 77.209, zoom: 12 },
    'Ahmedabad': { lat: 23.0225, lng: 72.5714, zoom: 12 },
    'Jaipur': { lat: 26.9124, lng: 75.7873, zoom: 12 },
    'Lucknow': { lat: 26.8467, lng: 80.9462, zoom: 12 },
    'Khordha (Bhubaneswar)': { lat: 20.2961, lng: 85.8245, zoom: 12 },
    'Cuttack': { lat: 20.4625, lng: 85.883, zoom: 12 },
  };

  if (districtName && districtMap[districtName]) {
    return districtMap[districtName];
  }

  return {
    lat: state.centerLat,
    lng: state.centerLng,
    zoom: state.defaultZoom,
  };
};
