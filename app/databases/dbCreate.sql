create database assets;
use assets;

create table employees
(
  emp_id           int auto_increment
    primary key,
  first_name       varchar(45)          not null,
  last_name        varchar(45)          not null,
  email            varchar(255)         null,
  affiliation      varchar(25)          null,
  department       varchar(45)          null,
  supervisor_id    int                  null,
  reviewer_id      int                  null,
  time_approver_id int                  null,
  inDate           date                 null,
  outDate          date                 null,
  notes            varchar(255)         null,
  archived         tinyint(1) default 0 null,
  constraint employees_employees__fk
    foreign key (supervisor_id) references employees (emp_id),
  constraint employees_employees__fk_2
    foreign key (reviewer_id) references employees (emp_id),
  constraint employees_employees__fk_3
    foreign key (time_approver_id) references employees (emp_id)
);

create table hardware
(
  hardware_id       int auto_increment,
  serial_number     varchar(45)          not null,
  model             varchar(45)          not null,
  description       varchar(255)         null,
  warranty_provider varchar(45)          null,
  owner             varchar(45)          null,
  contract          varchar(45)          null,
  cost              decimal(7, 2)        not null,
  vendor            varchar(45)          null,
  order_number      varchar(45)          null,
  warranty          varchar(25)          null,
  inDate            date                 null,
  outDate           date                 null,
  broken            tinyint(1) default 0 not null,
  comment           varchar(255)         null,
  archived          tinyint(1) default 0 not null,
  constraint hardware_hardware_id_uindex
    unique (hardware_id)
);

alter table hardware
  add primary key (hardware_id);

create table laptops
(
  laptop_id         int auto_increment
    primary key,
  serial_number     varchar(45)          null,
  model             varchar(45)          null,
  warranty_provider varchar(25)          null,
  cost              decimal(7, 2)        null,
  comment           varchar(255)         null,
  vendor            varchar(25)          null,
  order_num         varchar(25)          null,
  warranty          varchar(12)          null,
  inDate            date                 null,
  outDate           date                 null,
  department        varchar(25)          null,
  archived          tinyint(1) default 0 not null,
  broken            tinyint(1) default 0 not null
);

create table laptopHistory
(
  laptop_id int  not null,
  emp_id    int  not null,
  start     date null,
  end       date null,
  constraint history_employees__fk
    foreign key (emp_id) references employees (emp_id),
  constraint history_hardware__fk
    foreign key (laptop_id) references laptops (laptop_id)
);
create table software
(
  software_id int auto_increment
    primary key,
  name        varchar(45)          not null,
  cost        decimal(7,2)         not null,
  archived    tinyint(1) default 0 not null
);

create table licenses
(
  emp_id      int  not null,
  software_id int  not null,
  start       date null,
  end         date null,
  constraint licenses_employees_emp_id_fk
    foreign key (emp_id) references employees (emp_id),
  constraint licenses_software__fk
    foreign key (software_id) references software (software_id)
);


create database credentials;

create table credentials.admins
(
  user     varchar(50)  not null
    primary key,
  password varchar(100) not null
);


create database departments;

create table departments.departments
(
  value varchar(45) not null,
  label varchar(45) not null
);



