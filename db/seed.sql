update club_settings set opening_balance = 1200.00 where id = 1;
insert into donations (amount, donation_date, company_name, company_rep, notes) values
  (750.00, current_date - interval 'X days', 'AREMA Support', 'Danish Nadar', 'AREMA conference contribution'),
  (300.00, current_date - interval 'Y days', 'AREMA Support 2', 'Angel Vasquez', 'Weekly events sponsorship');
insert into expenses (amount, expense_date, description, person_name, company_name, company_rep) values
  (86.40, current_date - interval 'Z days', 'Rail funds', 'Treasurer', 'AREMA', null),
  (215.00, current_date - interval 'W days', 'Model funds', 'President', 'AREMA', 'The Pres');
