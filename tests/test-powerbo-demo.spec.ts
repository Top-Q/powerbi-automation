import { test, expect, FrameLocator, Locator } from '@playwright/test';

test('read read category breakdown values', async ({ page }) => {
  await page.goto('https://playground.powerbi.com/sampleReportEmbed');
  let frame: FrameLocator = page.locator('iframe').contentFrame();
  const pivotTableContainer = frame.locator('div.pivotTableContainer');
  await expect(pivotTableContainer).toBeVisible();
  let numberOfCols: number = await pivotTableContainer.locator('div.top-viewport div[role="columnheader"]').count();
  const cols: string[] = [];
  for (let i = 0; i < numberOfCols; i++) {
    let colLocator: Locator = pivotTableContainer.locator('div.top-viewport div[role="columnheader"]').nth(i);
    let col: string | null = await colLocator.textContent();
    if (col) {
      cols.push(col);
    }
  }
  console.log(cols);
  const numberOfRows: number = await pivotTableContainer.locator('div.mid-viewport div[role="row"]').count();
  for (let i = 0; i < numberOfRows; i++) {
    const rowValues: string[] = [];
    let rowLocator: Locator = pivotTableContainer.locator('div.mid-viewport div[role="row"]').nth(i);
    let rowheader = await rowLocator.locator('div[role="rowheader"]').textContent();
    if (rowheader) {
      rowValues.push(rowheader);
    }
    const numberOfCells: number = await rowLocator.locator('div[role="presentation"] div[role="gridcell"] div.pivotTableCellNoWrap').count(); 
    for (let j = 0; j < numberOfCells; j++) {
      let cellLocator: Locator = rowLocator.locator('div[role="presentation"] div[role="gridcell"] div.pivotTableCellNoWrap').nth(j);
      let cell: string | null = await cellLocator.textContent();
      if (cell) {
        rowValues.push(cell);
      }      
    }
    console.log(rowValues);

  }
  // div.pivotTableContainer div.top-viewport div[role="columnheader"] 
});



test('read bar values', async ({ page }) => {
  await page.goto('https://playground.powerbi.com/sampleReportEmbed');
  let frame: FrameLocator = page.locator('iframe').contentFrame();
  let stackedColumnChartLocator: Locator = frame.locator('[name="Stacked column chart"]');
  let listBoxLocator: Locator = stackedColumnChartLocator.locator('g.series[role="listbox"]');
  await expect(listBoxLocator).toBeVisible();
  let numberOfBars: number = await listBoxLocator.locator('rect.column').count();
  
  for (let i = 0; i < numberOfBars; i++) {
    let tickTextLocator: Locator = stackedColumnChartLocator.locator('text[data-automation-type="axis-tick-text"]>title').nth(i);
    let tickText: string | null = await tickTextLocator.textContent();    
    let barLocator: Locator = listBoxLocator.locator('rect.column').nth(i);
    let value: string | null = await barLocator.getAttribute('aria-label')
    console.log(`Bar ${i + 1}: ${tickText} - ${value}`);
  }
});