# UI Testing Plan: Onsite Reporting App Prototype

1. Test Dashboard (Home Screen) - PASSED

- Verify dashboard loads with issue counts and statistics
Confirm "Recent Activity" shows latest issues (or empty state)


2. Create a new issue - PASSED

- Tap "Report New Issue" from dashboard
  Fill in required fields:

  Title: "Test Issue"
  Description: "This is a test issue for verification"
  Location: "Test Location"
  Severity: Choose any level


3. Add photos - PASSED

- Tap the camera icon to take a photo
- Tap the gallery icon to select from gallery


- Tap "Create Issue"
- Verify success message appears


4. Verify issue in list - PASSED

- Navigate to "Issues" tab 
- Confirm new issue appears in the list 
- Verify issue details match what was entered


5. View issue details - PASSED

- Tap on the created issue in the list - PASSED
- Verify all details match input data - PASSED
- Check photos are displayed correctly in the gallery - PASSED


6. Test photo deletion - PASSED

- In issue details, tap the X on a photo - PASSED
- Confirm photo removal prompt -PASSED
- Verify photo is removed from the gallery - PASSED


7. Test issue deletion - PASSED

- In issue details, tap "Delete Issue" - PASSED
- Confirm deletion prompt - PASSED
- Verify redirect to dashboard - PASSED 
- Confirm issue is removed from dashboard statistics - PASSED
- Navigate to Issues tab and verify issue no longer appears - PASSED


8. Test offline persistence - PENDING

- Create another issue with photos
- Force close the app completely
- Reopen the app
- Navigate to Issues tab
- Verify issue and photos persist


9. Verify error handling - PENDING

- Test form validation by attempting to submit an incomplete issue
Verify appropriate error messages appear