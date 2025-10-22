import { Component } from '@angular/core';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css']
})
export class CustomerProfileComponent {
  activeTab: string = 'personal';

  getTabClass(tabName: string): string {
    const baseClasses = 'w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-all duration-200';
    const activeClasses = 'bg-purple-50 text-purple-600 border-r-4 border-purple-600';
    const inactiveClasses = 'text-gray-700 hover:bg-purple-50 hover:text-purple-600';
    
    return `${baseClasses} ${this.activeTab === tabName ? activeClasses : inactiveClasses}`;
  }
}
