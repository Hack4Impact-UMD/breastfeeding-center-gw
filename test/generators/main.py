#!/bin/python3
import csv
import random
from datetime import datetime, timedelta
import faker
import argparse

# --------------------------------------
# COMMAND LINE ARGUMENTS
# --------------------------------------
parser = argparse.ArgumentParser(description="Generate mock appointment and client data.")
parser.add_argument(
    "--months",
    type=int,
    default=3,
    help="The number of past months to generate appointments over. Default is 3.",
)
parser.add_argument(
    "--num-appts",
    type=int,
    default=300,
    help="The number of parent appointments to generate. Default is 300.",
)
args = parser.parse_args()


fake = faker.Faker()

APPT_FILE = "mock_appointments.csv"
CLIENT_FILE = "mock_clients.csv"

# --------------------------------------
# HEADERS
# --------------------------------------
APPT_HEADERS = [
    "id","location_name","start_at","end_at","patient_guid","patient_number",
    "patient_prefix","patient_first_name","patient_preferred_name","patient_last_name",
    "treatment_name","staff_member_name","break","insurance_state","state","first_visit",
    "chart_status","notes_text","booked_at","arrived_at","booked_online","archived_at",
    "no_show_at","cancelled_at","cancelled_reason","referral_source"
]

CLIENT_HEADERS = [
    "patient_guid","Patient Number","Member Since","First Name","Preferred Name","Middle Name",
    "Last Name","Email","Email Status","Home Phone","Mobile Phone","Work Phone","Fax Phone",
    "Street Address","Street Address 2","City","Province","Postal","Country","Birth Date",
    "Sex","Gender","Pronouns","Insurance Company Name","Referral Source","Referred To",
    "Marketing Email Opt In","Do Not Email","Family Doctor","Family Doctor Phone",
    "Family Doctor Email","Guardian Name","Medical Alert","Emergency Contact Name",
    "Emergency Contact Phone","Emergency Contact Relationship","Occupation","Employer",
    "Referring Professional","Referring Professional Email","Referring Professional Phone",
    "First Visit","Last Visit","Deceased At","Discharged At","Active","Online Booking Policy"
]

# --------------------------------------
# SETTINGS
# --------------------------------------
LOCATION = "The Breastfeeding Center in DC"

ADULT_TREATMENTS = [
    "HOME VISIT",
    "OFFICE",
    "TELEHEALTH",
]

BABY_TREATMENTS = [
    "Infant Feeding Consultation",
    "Baby Lactation Assessment",
]

STAFF = ["Test", "Dr. Smith", "Nurse Johnson", "Theresa Brown"]
REFERRAL_SOURCES = ["JANE", "Google", "Hospital", "Friend", "OBGYN"]

NOW = datetime.now()
APPOINTMENT_PERIOD_START = NOW - timedelta(days=args.months * 30)

fake = faker.Faker()

# Track patients (parents and babies)
patient_registry = {}

# --------------------------------------
# HELPERS
# --------------------------------------
def get_random_dt_in_period():
    return fake.date_time_between(start_date=APPOINTMENT_PERIOD_START, end_date=NOW)

def dt_str(dt):
    return dt.strftime("%Y-%m-%d %H:%M:%S -0500")

def generate_adult_patient():
    first = fake.first_name()
    last = fake.last_name()
    preferred = first if random.random() > 0.2 else fake.first_name()

    return {
        "First Name": first,
        "Preferred Name": preferred,
        "Middle Name": fake.first_name() if random.random() < 0.1 else "",
        "Last Name": last,
        "Birth Date": fake.date_of_birth(minimum_age=20, maximum_age=45).strftime("%Y-%m-%d"),
        "Is Baby": False
    }

def generate_baby(parent):
    first = fake.first_name()
    last = parent["Last Name"]

    return {
        "First Name": first,
        "Preferred Name": f"Baby {first}",
        "Middle Name": "Baby",
        "Last Name": last,
        "Birth Date": fake.date_between(start_date="-18m", end_date="today").strftime("%Y-%m-%d"),
        "Is Baby": True
    }

def fill_patient_common_fields(patient):
    """Adds demographic, insurance, contact info common to all customers"""
    patient.update({
        "Email": fake.email() if not patient["Is Baby"] else "",
        "Home Phone": fake.phone_number() if not patient["Is Baby"] else "",
        "Mobile Phone": fake.phone_number() if not patient["Is Baby"] else "",
        "Work Phone": "",
        "Fax Phone": "",
        "Street Address": fake.street_address(),
        "Street Address 2": "",
        "City": fake.city(),
        "Province": fake.state_abbr(),
        "Postal": fake.postcode(),
        "Country": fake.country(),
        "Sex": random.choice(["M", "F"]),
        "Gender": random.choice(["Male", "Female", "Nonbinary"]),
        "Pronouns": random.choice(["she/her", "he/him", "they/them"]),
        "Insurance Company Name": random.choice(["Aetna", "BCBS", "Cigna", "United Healthcare"]),
        "Referral Source": random.choice(REFERRAL_SOURCES),
        "Referred To": "",
        "Marketing Email Opt In": random.choice(["true", "false"]),
        "Do Not Email": random.choice(["false", "false", "true"]),
        "Family Doctor": fake.name(),
        "Family Doctor Phone": fake.phone_number(),
        "Family Doctor Email": fake.email(),
        "Guardian Name": "",
        "Medical Alert": "",
        "Emergency Contact Name": fake.name(),
        "Emergency Contact Phone": fake.phone_number(),
        "Emergency Contact Relationship": random.choice(["Spouse", "Parent", "Sibling", "Friend"]),
        "Occupation": fake.job() if not patient["Is Baby"] else "",
        "Employer": fake.company() if not patient["Is Baby"] else "",
        "Referring Professional": fake.name(),
        "Referring Professional Email": fake.email(),
        "Referring Professional Phone": fake.phone_number(),
        "Deceased At": "",
        "Discharged At": "",
        "Active": "true",
        "Online Booking Policy": "default"
    })

# --------------------------------------
# GENERATE APPOINTMENTS
# --------------------------------------
appointments = []
next_id = 123

def create_patient_and_register(is_baby=False, parent=None):
    guid = f"{random.randint(10000,20000)}-{random.randint(20000,30000)}"

    if not is_baby:
        patient = generate_adult_patient()
    else:
        patient = generate_baby(parent)

    fill_patient_common_fields(patient)

    patient["Patient Number"] = random.randint(10000,20000)
    patient["Member Since"] = fake.date_between(start_date="-2y", end_date="today").strftime("%Y-%m-%d")
    patient["First Visit"] = ""
    patient["Last Visit"] = ""

    patient_registry[guid] = patient
    return guid

# --------------------------------------
# WRITE APPOINTMENTS (INCLUDING BABIES)
# --------------------------------------
with open(APPT_FILE, "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(APPT_HEADERS)

    # Create a series of appointments for each of the number of clients specified.
    for i in range(args.num_appts):
        # 1. Create family
        clinician = random.choice(STAFF)
        parent_guid = create_patient_and_register(is_baby=False)
        parent = patient_registry[parent_guid]

        baby_guids = []
        num_babies = random.randint(0, 2)
        for _ in range(num_babies):
            baby_guid = create_patient_and_register(is_baby=True, parent=parent)
            baby = patient_registry[baby_guid]
            baby["Guardian Name"] = f"{parent['First Name']} {parent['Last Name']}"
            baby_guids.append(baby_guid)

        # 2. Set up appointment series
        appointments_to_create = []
        first_appt_start = get_random_dt_in_period()
        appointments_to_create.append(first_appt_start)

        last_appt_end = None

        if random.random() < 0.3: # 30% chance of recurring appointments
            num_recurring = random.randint(1, 6)
            for week_offset in range(1, num_recurring + 1):
                next_appt_start = first_appt_start + timedelta(weeks=week_offset)
                if next_appt_start < NOW:
                    appointments_to_create.append(next_appt_start)
                else:
                    break

        # 3. Write appointments for the series
        for idx, start_time in enumerate(appointments_to_create):
            is_first_visit = (idx == 0)
            end_time = start_time + timedelta(hours=random.choice([1, 1.5, 2]))

            # Keep track of first and last visit times for the client record
            if is_first_visit:
                parent["First Visit"] = dt_str(start_time)
                for baby_guid in baby_guids:
                    patient_registry[baby_guid]["First Visit"] = dt_str(start_time)
            
            last_appt_end = end_time # continuously update, last one will stick

            # Write parent appointment for this occurrence
            global_id = next_id
            next_id += 1
            writer.writerow([
                global_id,
                LOCATION,
                dt_str(start_time),
                dt_str(end_time),
                parent_guid,
                parent["Patient Number"],
                "",
                parent["First Name"],
                parent["Preferred Name"],
                parent["Last Name"],
                random.choice(ADULT_TREATMENTS),
                clinician,
                "",
                "",
                "",
                "true" if is_first_visit else "false",
                random.choice(["signed","unsigned"]),
                "",
                dt_str(get_random_dt_in_period()),
                dt_str(get_random_dt_in_period()),
                random.choice(["true","false"]),
                "",
                "",
                "",
                "",
                parent["Referral Source"]
            ])

            # Write baby appointments for this occurrence
            for baby_guid in baby_guids:
                baby = patient_registry[baby_guid]
                next_id += 1
                writer.writerow([
                    next_id,
                    LOCATION,
                    dt_str(start_time),
                    dt_str(end_time), # same start and end as parent
                    baby_guid,
                    baby["Patient Number"],
                    "",
                    baby["First Name"],
                    baby["Preferred Name"],
                    baby["Last Name"],
                    random.choice(BABY_TREATMENTS),
                    clinician,           # same clinician
                    "",
                    "",
                    "",
                    "false", # baby visit is never the 'first'
                    "",
                    "",
                    dt_str(get_random_dt_in_period()),
                    "",
                    "false",
                    "",
                    "",
                    "",
                    "",
                    "Parent"
                ])

        # 4. Update last visit for the family
        if last_appt_end:
            parent["Last Visit"] = dt_str(last_appt_end)
            for baby_guid in baby_guids:
                patient_registry[baby_guid]["Last Visit"] = dt_str(last_appt_end)

print(f"Generated appointment series for {args.num_appts} parent clients in appointments.csv.")

# --------------------------------------
# WRITE CLIENTS CSV
# --------------------------------------
with open(CLIENT_FILE, "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(CLIENT_HEADERS)

    for guid, p in patient_registry.items():
        writer.writerow([
            guid,
            p["Patient Number"],
            p["Member Since"],
            p["First Name"],
            p["Preferred Name"],
            p["Middle Name"],
            p["Last Name"],
            p["Email"],
            "active",
            p["Home Phone"],
            p["Mobile Phone"],
            p["Work Phone"],
            p["Fax Phone"],
            p["Street Address"],
            p["Street Address 2"],
            p["City"],
            p["Province"],
            p["Postal"],
            p["Country"],
            p["Birth Date"],
            p["Sex"],
            p["Gender"],
            p["Pronouns"],
            p["Insurance Company Name"],
            p["Referral Source"],
            p["Referred To"],
            p["Marketing Email Opt In"],
            p["Do Not Email"],
            p["Family Doctor"],
            p["Family Doctor Phone"],
            p["Family Doctor Email"],
            p["Guardian Name"],
            p["Medical Alert"],
            p["Emergency Contact Name"],
            p["Emergency Contact Phone"],
            p["Emergency Contact Relationship"],
            p["Occupation"],
            p["Employer"],
            p["Referring Professional"],
            p["Referring Professional Email"],
            p["Referring Professional Phone"],
            p["First Visit"],
            p["Last Visit"],
            p["Deceased At"],
            p["Discharged At"],
            p["Active"],
            p["Online Booking Policy"]
        ])

print("clients.csv generated with babies included.")
