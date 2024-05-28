import {Component, OnInit} from '@angular/core';
import {
  GanttBarClickEvent,
  GanttDate,
  GanttGroup,
  GanttItem,
  GanttViewOptions,
  GanttViewType,
  NgxGanttModule,
  registerView
} from "@worktile/gantt";
import {addDays, getUnixTime} from "date-fns";
import {GanttViewCustom} from "./custom-view";

const customViewType = 'custom' as GanttViewType;
registerView(customViewType, GanttViewCustom);

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [NgxGanttModule],
})
export class AppComponent implements OnInit {
  items: GanttItem[] = [];
  groups: GanttGroup[] = [];

  readonly type = customViewType;
  readonly options: GanttViewOptions = {
    cellWidth: 40,
    min: new GanttDate().addWeeks(-1),
    max: new GanttDate().addWeeks(5),
    start: new GanttDate().addWeeks(-1),
    end: new GanttDate().addWeeks(5),
  };

  ngOnInit(): void {
    const {groups, items} = randomGroupsAndItems(5);
    this.groups = groups;
    this.items = items;
  }

  barClicked(event: GanttBarClickEvent): void {
    console.log(event.item);
  }
}

const random = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const randomItems = (length: number, groupId?: string): GanttItem[] => {
  const items: GanttItem[] = [];
  for (let i = 0; i < length; i++) {
    const start = addDays(new Date(), random(-28, 28));
    const end = addDays(start, random(7, 28));

    items.push({
      id: `${Math.floor(Math.random() * 100000000)}`,
      title: `Task-${i}`,
      start: getUnixTime(start),
      end: getUnixTime(end),
      group_id: groupId,
    });
  }

  return items;
};

function randomGroupsAndItems(length: number) {
  const groups: GanttGroup[] = [];
  let items: GanttItem[] = [];
  for (let i = 0; i < length; i++) {
    groups.push({
      id: `00000${i}`,
      title: `Group-${i}`,
    });

    items = [...items, ...randomItems(random(0, 7), groups[i].id)];
  }

  return {
    groups,
    items
  };
}
