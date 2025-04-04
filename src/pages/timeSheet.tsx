import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,  
  useDisclosure,
  Checkbox,  
  Link,  
  Table,
  Select, 
  SelectItem,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
  DatePicker,
  DateRangePicker,
  Avatar
} from "@heroui/react";
import {parseZonedDateTime, parseAbsoluteToLocal} from "@internationalized/date";

import DefaultLayout from "@/layouts/default";
import { ChevronDownIcon, PlusIcon, SearchIcon, VerticalDotsIcon, RefreshIcon, SaveIcon } from '@/components/icons';

export const columns = [
  {name: "ID", uid: "id", sortable: true},
  {name: "HORA INICIO", uid: "startTime", sortable: true},
  {name: "HORA FIN", uid: "endTime", sortable: true},  
  {name: "TIPO ACTIVIDAD", uid: "activityType", sortable: true},
  {name: "PROYECTO", uid: "project", sortable: true},
  { name: "LOCATION", uid: "location", sortable: true },
  {name: "ACTIONS", uid: "actions"},
];

export const users = [
  {
    id: 1,
    name: "Tony Reichert",
    role: "CEO",
    team: "Management",
    status: "active",
    age: "29",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png",
    email: "tony.reichert@example.com",
  },
  {
    id: 2,
    name: "Zoey Lang",
    role: "Tech Lead",
    team: "Development",
    status: "paused",
    age: "25",
    avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/1.png",
    email: "zoey.lang@example.com",
  },
];

export const locationOptions = [
  { name: "Oficina", uid: "oficina" },
  { name: "Sala de Reuniones", uid: "sala_reuniones" },
  { name: "Remoto", uid: "remoto" },
];

export const activityOptions = [
  {name: "Desarrollo", uid: "development"},
  {name: "Reunión", uid: "meeting"},
  {name: "Documentación", uid: "documentation"},
];

export const projectsOptions = [
  {name: "Finance", uid: "finance"},
  {name: "Unity", uid: "unity"},
];

export const timeEntries = [
  {
    id: 1,
    startTime: "09:00",
    endTime: "11:30",
    activityType: "development",
    project: "Proyecto A",
    location: "Oficina",
  },
  {
    id: 2,
    startTime: "11:45",
    endTime: "13:00",
    activityType: "meeting",
    project: "Proyecto B",
    location: "Sala de Reuniones",
  },
  {
    id: 3,
    startTime: "14:00",
    endTime: "17:30",
    activityType: "documentation",
    project: "Proyecto A",
    location: "Remoto",
  },
];

export function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

// Función para calcular la duración en horas
const calculateTotalDuration = (entries) => {
  return entries.reduce((total, entry) => {
    const start = new Date(`1970-01-01T${entry.startTime}:00`);
    const end = new Date(`1970-01-01T${entry.endTime}:00`);
    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60); // Convertir a horas
    return total + duration;
  }, 0).toFixed(2); // Retornar con dos decimales
};

// En el componente TimeSheetPage, calcular la duración total
const totalDuration = calculateTotalDuration(timeEntries);

const activityColorMap = {
  development: "success",
  meeting: "warning",
  documentation: "primary",
};

const INITIAL_VISIBLE_COLUMNS = ["startTime", "endTime", "activityType", "project", "location", "actions"];

export default function TimeSheetPage() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [activityFilter, setActivityFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "startTime",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const pages = Math.ceil(timeEntries.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredEntries = [...timeEntries];

    if (hasSearchFilter) {
      filteredEntries = filteredEntries.filter((entry) =>
        entry.project.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (activityFilter !== "all" && Array.from(activityFilter).length !== activityOptions.length) {
      filteredEntries = filteredEntries.filter((entry) =>
        Array.from(activityFilter).includes(entry.activityType),
      );
    }

    return filteredEntries;
  }, [timeEntries, filterValue, activityFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((entry, columnKey) => {
    const cellValue = entry[columnKey];

    switch (columnKey) {
      case "startTime":
      case "endTime":
        return (
          <Chip
            className="bg-default-100 border-none"
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );        
      case "activityType":
        return (
          <Chip
            className="capitalize border-none gap-1 text-default-600"
            color={activityColorMap[entry.activityType]}
            size="sm"
            variant="dot"
          >
            {activityOptions.find(opt => opt.uid === cellValue)?.name || cellValue}
          </Chip>
        );
      case "location": 
        return (
          <span className="text-default-600">{cellValue}</span>
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown className="bg-background border-1 border-default-200">
              <DropdownTrigger>
                <Button isIconOnly radius="full" size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-400" width={undefined} height={undefined} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem key="edit">Editar</DropdownItem>
                <DropdownItem key="delete">Eliminar</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className='block md:flex space-x-5 flex items-center flex-wrap'>
          <Select
            className="max-w-xs my-4"
            classNames={{
              label: "group-data-[filled=true]:-translate-y-5",
              trigger: "min-h-12",
              listboxWrapper: "max-h-[400px]",
            }}
            items={users}
            label="Select an User"
            listboxProps={{
              itemClasses: {
                base: [
                  "rounded-md",
                  "text-default-500",
                  "transition-opacity",
                  "data-[hover=true]:text-foreground",
                  "data-[hover=true]:bg-default-100",
                  "dark:data-[hover=true]:bg-default-50",
                  "data-[selectable=true]:focus:bg-default-50",
                  "data-[pressed=true]:opacity-70",
                  "data-[focus-visible=true]:ring-default-500",
                ],
              },
            }}
            popoverProps={{
              classNames: {
                base: "before:bg-default-200",
                content: "p-0 border-small border-divider bg-background",
              },
            }}
            renderValue={(items) => {
              return items.map((item) => (
                <div key={item.key} className="flex items-center">                  
                  <div className="flex flex-col">
                    <span>{item.data.name}</span>                    
                  </div>
                </div>
              ));
            }}
            variant="bordered"
          >
            {(user) => (
              <SelectItem key={user.id} textValue={user.name}>
                <div className="flex gap-2 items-center">                  
                  <div className="flex flex-col">
                    <span className="text-small">{user.name}</span>                    
                  </div>
                </div>
              </SelectItem>
            )}
          </Select>

          <DateRangePicker 
            showMonthAndYearPickers 
            label="Select a date" 
            variant="bordered" 
            className="max-w-[284px]"
          />

          <Button isIconOnly aria-label="Like" className="bg-[#eeeeef]">
            <RefreshIcon />
          </Button>
          
          <Button isIconOnly aria-label="Like" color='primary'>
            <SaveIcon />
          </Button>
          
          {/* <DatePicker isRequired variant='faded' className="max-w-[284px]" label="Select a date" /> */}
        </div>
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1",
            }}
            placeholder="Buscar por proyecto..."
            size="sm"
            startContent={<SearchIcon className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Chip className="bg-[#eeeeef] p-4 rounded-md border-none dark:text-white dark:bg-[#19191c]" size="sm" variant="flat">
              Duración Total: {totalDuration} horas
            </Chip>            
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Tipo de Actividad
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={activityFilter}
                selectionMode="multiple"
                onSelectionChange={setActivityFilter}
              >
                {activityOptions.map((activity) => (
                  <DropdownItem key={activity.uid} className="capitalize">
                    {capitalize(activity.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  size="sm"
                  variant="flat"
                >
                  Columnas
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button 
              className="bg-foreground text-background" 
              endContent={<PlusIcon width={undefined} height={undefined} />} 
              size="sm"
              onPress={onOpen}  
            >
              Agregar Nuevo
            </Button>
            <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">Add time sheet</ModalHeader>
                    <ModalBody>
                    <DatePicker
                      className="w-full"
                      defaultValue={parseZonedDateTime("2022-11-07T00:45[America/Los_Angeles]")}
                      label="Start Time"
                      labelPlacement="outside"
                    />
                    <DatePicker
                      className="w-full"
                      defaultValue={parseAbsoluteToLocal("2021-11-07T07:45:00Z")}
                      label="End Time"
                      labelPlacement="outside"
                    />  
                    <Select className="w-full my-2" label="Activity Types">
                      {activityOptions.map((activity) => (
                        <SelectItem key={activity.uid}>{activity.name}</SelectItem>
                      ))}
                    </Select>                                     
                    <Select className="w-full" label="Projects">
                      {projectsOptions.map((project) => (
                        <SelectItem key={project.uid}>{project.name}</SelectItem>
                      ))}
                    </Select>
                    <Select className="w-full my-2" label="Location">
                      {locationOptions.map((location) => (
                        <SelectItem key={location.uid}>{location.name}</SelectItem>
                      ))}
                    </Select>                                                                               
                    </ModalBody>
                    <ModalFooter>
                      <Button color="danger" variant="flat" onPress={onClose}>
                        Close
                      </Button>
                      <Button color="primary" onPress={onClose}>
                        Add
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>
        </div>        
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {timeEntries.length} registros</span>          
          <label className="flex items-center text-default-400 text-small">
            Filas por página:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    activityFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    timeEntries.length,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">        
        <span className="text-small text-default-400">
          {selectedKeys === "all"
            ? "Todos los registros seleccionados"
            : `${selectedKeys.size} de ${items.length} seleccionados`}
        </span>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  const classNames = React.useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      td: [
        "group-data-[first=true]/tr:first:before:rounded-none",
        "group-data-[first=true]/tr:last:before:rounded-none",
        "group-data-[middle=true]/tr:before:rounded-none",
        "group-data-[last=true]/tr:first:before:rounded-none",
        "group-data-[last=true]/tr:last:before:rounded-none",
      ],
    }),
    [],
  );

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="w-full max-w-[1024px]">
          <Table
            isCompact
            removeWrapper
            aria-label="Tabla de registro de tiempos"
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            checkboxesProps={{
              classNames: {
                wrapper: "after:bg-foreground after:text-background text-background",
              },
            }}
            classNames={classNames}
            selectedKeys={selectedKeys}
            selectionMode="none"
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
          >
            <TableHeader columns={headerColumns}>
              {(column) => (
                <TableColumn
                  key={column.uid}
                  align={column.uid === "actions" ? "center" : "start"}
                  allowsSorting={column.sortable}
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody emptyContent={"No hay registros"} items={sortedItems}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </DefaultLayout>
  );
}