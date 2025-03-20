const reports={template:`
<div>
    <h2 class="mb-4">レポート・統計</h2>
    
    <!-- レポート選択 -->
    <div class="mb-4">
        <div class="btn-group" role="group">
            <button type="button" class="btn" :class="{'btn-primary': activeReport === 'inventory', 'btn-outline-primary': activeReport !== 'inventory'}" @click="setActiveReport('inventory')">
                在庫統計
            </button>
            <button type="button" class="btn" :class="{'btn-primary': activeReport === 'category', 'btn-outline-primary': activeReport !== 'category'}" @click="setActiveReport('category')">
                カテゴリ別集計
            </button>
            <button type="button" class="btn" :class="{'btn-primary': activeReport === 'value', 'btn-outline-primary': activeReport !== 'value'}" @click="setActiveReport('value')">
                在庫価値分析
            </button>
        </div>
    </div>
    
    <!-- 在庫統計レポート -->
    <div v-if="activeReport === 'inventory'" class="mb-5">
        <div class="card">
            <div class="card-header bg-primary text-white">
                <h3 class="mb-0">在庫統計</h3>
            </div>
            <div class="card-body">
                <div v-if="loadingInventory" class="text-center my-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">読み込み中...</span>
                    </div>
                    <p class="mt-2">データを読み込んでいます...</p>
                </div>
                
                <div v-else-if="inventoryStats.total_items === 0" class="alert alert-info">
                    商品データがありません。
                </div>
                
                <div v-else>
                    <div class="row mb-4">
                        <div class="col-md-3">
                            <div class="card bg-light">
                                <div class="card-body text-center">
                                    <h2>{{ inventoryStats.total_items }}</h2>
                                    <p class="mb-0">商品総数</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card bg-light">
                                <div class="card-body text-center">
                                    <h2>{{ inventoryStats.total_stock_quantity }}</h2>
                                    <p class="mb-0">総在庫数</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card bg-light">
                                <div class="card-body text-center">
                                    <h2>{{ inventoryStats.average_stock_per_item.toFixed(1) }}</h2>
                                    <p class="mb-0">平均在庫数/商品</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="card bg-light">
                                <div class="card-body text-center">
                                    <h2>¥{{ inventoryStats.price_statistics.average_price.toLocaleString() }}</h2>
                                    <p class="mb-0">平均価格</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <h4 class="mb-3">在庫状態</h4>
                    <div class="progress mb-4" style="height: 30px;">
                        <div class="progress-bar bg-success" 
                             :style="'width: ' + inventoryStats.stock_status.normal_stock_percentage + '%'" 
                             role="progressbar" 
                             :aria-valuenow="inventoryStats.stock_status.normal_stock_percentage" 
                             aria-valuemin="0" 
                             aria-valuemax="100">
                            {{ inventoryStats.stock_status.normal_stock_percentage.toFixed(1) }}% 在庫あり
                        </div>
                        <div class="progress-bar bg-warning" 
                             :style="'width: ' + inventoryStats.stock_status.low_stock_percentage + '%'" 
                             role="progressbar" 
                             :aria-valuenow="inventoryStats.stock_status.low_stock_percentage" 
                             aria-valuemin="0" 
                             aria-valuemax="100">
                            {{ inventoryStats.stock_status.low_stock_percentage.toFixed(1) }}% 在庫僅少
                        </div>
                        <div class="progress-bar bg-danger" 
                             :style="'width: ' + inventoryStats.stock_status.out_of_stock_percentage + '%'" 
                             role="progressbar" 
                             :aria-valuenow="inventoryStats.stock_status.out_of_stock_percentage" 
                             aria-valuemin="0" 
                             aria-valuemax="100">
                            {{ inventoryStats.stock_status.out_of_stock_percentage.toFixed(1) }}% 在庫なし
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="card mb-3">
                                <div class="card-header">価格統計</div>
                                <div class="card-body">
                                    <ul class="list-group list-group-flush">
                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                            最高価格
                                            <span class="badge bg-primary">¥{{ inventoryStats.price_statistics.max_price.toLocaleString() }}</span>
                                        </li>
                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                            平均価格
                                            <span class="badge bg-primary">¥{{ inventoryStats.price_statistics.average_price.toLocaleString() }}</span>
                                        </li>
                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                            最低価格
                                            <span class="badge bg-primary">¥{{ inventoryStats.price_statistics.min_price.toLocaleString() }}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card mb-3">
                                <div class="card-header">在庫アラート</div>
                                <div class="card-body">
                                    <ul class="list-group list-group-flush">
                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                            緊急発注が必要
                                            <span class="badge bg-danger">{{ inventoryStats.inventory_alerts.critical_low_stock }} 商品</span>
                                        </li>
                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                            在庫過剰
                                            <span class="badge bg-warning text-dark">{{ inventoryStats.inventory_alerts.excess_stock }} 商品</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- カテゴリ別集計レポート -->
    <div v-if="activeReport === 'category'" class="mb-5">
        <div class="card">
            <div class="card-header bg-primary text-white">
                <h3 class="mb-0">カテゴリ別商品・在庫分析</h3>
            </div>
            <div class="card-body">
                <div v-if="loadingCategory" class="text-center my-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">読み込み中...</span>
                    </div>
                    <p class="mt-2">データを読み込んでいます...</p>
                </div>
                
                <div v-else-if="categoryData.length === 0" class="alert alert-info">
                    カテゴリデータがありません。
                </div>
                
                <div v-else>
                    <div class="table-responsive">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>カテゴリ名</th>
                                    <th class="text-center">商品数</th>
                                    <th class="text-end">在庫価値合計</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-for="category in categoryData">
                                    <tr>
                                        <td>
                                            <strong>{{ category.name }}</strong>
                                            <button v-if="category.subcategories && category.subcategories.length > 0" 
                                                    class="btn btn-sm btn-outline-secondary ms-2"
                                                    @click="toggleSubcategories(category)">
                                                {{ category.showSubcategories ? '隠す' : '詳細' }}
                                            </button>
                                        </td>
                                        <td class="text-center">{{ category.item_count }}</td>
                                        <td class="text-end">¥{{ category.total_value.toLocaleString() }}</td>
                                    </tr>
                                    <template v-if="category.showSubcategories && category.subcategories && category.subcategories.length > 0">
                                        <tr v-for="subcat in category.subcategories" class="table-light">
                                            <td class="ps-4">└ {{ subcat.name }}</td>
                                            <td class="text-center">{{ subcat.item_count }}</td>
                                            <td class="text-end">¥{{ subcat.total_value.toLocaleString() }}</td>
                                        </tr>
                                    </template>
                                </template>
                            </tbody>
                        </table>
                    </div>
                    
                    <div v-if="hasChartJS" class="mt-5">
                        <h4>カテゴリ別商品数分布</h4>
                        <canvas id="categoryItemCountChart" width="400" height="200"></canvas>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- 在庫価値分析レポート -->
    <div v-if="activeReport === 'value'" class="mb-5">
        <div class="card">
            <div class="card-header bg-primary text-white">
                <h3 class="mb-0">在庫価値分析</h3>
            </div>
            <div class="card-body">
                <div v-if="loadingValue" class="text-center my-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">読み込み中...</span>
                    </div>
                    <p class="mt-2">データを読み込んでいます...</p>
                </div>
                
                <div v-else-if="!valueData.total_stock_value" class="alert alert-info">
                    在庫価値データがありません。
                </div>
                
                <div v-else>
                    <div class="row mb-4">
                        <div class="col-md-4">
                            <div class="card bg-light">
                                <div class="card-body text-center">
                                    <h2>¥{{ valueData.total_stock_value.toLocaleString() }}</h2>
                                    <p class="mb-0">総在庫価値</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">在庫状態別価値</h5>
                                    <div class="progress mb-2" style="height: 25px;">
                                        <div class="progress-bar bg-success" 
                                             :style="'width: ' + (valueData.stock_value_by_status.normal_stock / valueData.total_stock_value * 100) + '%'" 
                                             role="progressbar">
                                            在庫あり: ¥{{ valueData.stock_value_by_status.normal_stock.toLocaleString() }}
                                        </div>
                                        <div class="progress-bar bg-warning" 
                                             :style="'width: ' + (valueData.stock_value_by_status.low_stock / valueData.total_stock_value * 100) + '%'" 
                                             role="progressbar">
                                            在庫僅少: ¥{{ valueData.stock_value_by_status.low_stock.toLocaleString() }}
                                        </div>
                                        <div class="progress-bar bg-danger" 
                                             :style="'width: ' + (valueData.stock_value_by_status.out_of_stock / valueData.total_stock_value * 100) + '%'" 
                                             role="progressbar">
                                            在庫なし: ¥{{ valueData.stock_value_by_status.out_of_stock.toLocaleString() }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="card mb-4">
                                <div class="card-header">カテゴリ別価値</div>
                                <div class="card-body">
                                    <div class="table-responsive" style="max-height: 300px; overflow-y: auto;">
                                        <table class="table table-sm">
                                            <thead>
                                                <tr>
                                                    <th>カテゴリ</th>
                                                    <th class="text-end">金額</th>
                                                    <th class="text-end">割合</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="cat in valueData.category_values">
                                                    <td>{{ cat.name }}</td>
                                                    <td class="text-end">¥{{ cat.value.toLocaleString() }}</td>
                                                    <td class="text-end">{{ cat.percentage.toFixed(1) }}%</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card mb-4">
                                <div class="card-header">価値が高い商品 TOP 10</div>
                                <div class="card-body">
                                    <div class="table-responsive" style="max-height: 300px; overflow-y: auto;">
                                        <table class="table table-sm">
                                            <thead>
                                                <tr>
                                                    <th>商品名</th>
                                                    <th class="text-center">数量</th>
                                                    <th class="text-end">在庫価値</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="item in valueData.top_value_items">
                                                    <td>{{ item.name }}</td>
                                                    <td class="text-center">{{ item.quantity }}</td>
                                                    <td class="text-end">¥{{ item.value.toLocaleString() }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`,

data(){
    return {
        activeReport: 'inventory',
        
        // 在庫統計
        inventoryStats: {
            total_items: 0,
            total_stock_quantity: 0,
            average_stock_per_item: 0,
            price_statistics: {
                average_price: 0,
                max_price: 0,
                min_price: 0
            },
            stock_status: {
                out_of_stock: 0,
                out_of_stock_percentage: 0,
                low_stock: 0,
                low_stock_percentage: 0,
                normal_stock: 0,
                normal_stock_percentage: 0
            },
            inventory_alerts: {
                critical_low_stock: 0,
                excess_stock: 0
            }
        },
        loadingInventory: true,
        
        // カテゴリデータ
        categoryData: [],
        loadingCategory: true,
        
        // 在庫価値データ
        valueData: {
            total_stock_value: 0,
            stock_value_by_status: {
                out_of_stock: 0,
                low_stock: 0,
                normal_stock: 0
            },
            category_values: [],
            top_value_items: []
        },
        loadingValue: true,
        
        // ChartJSが存在するかどうか
        hasChartJS: false,
        categoryChart: null
    }
},
methods: {
    setActiveReport(report) {
        this.activeReport = report;
        
        // レポートが初めてアクティブになったときにのみデータを読み込む
        if (report === 'inventory' && this.loadingInventory) {
            this.loadInventoryStats();
        } else if (report === 'category' && this.loadingCategory) {
            this.loadCategoryData();
        } else if (report === 'value' && this.loadingValue) {
            this.loadValueData();
        }
        
        // カテゴリチャートを描画（すでにデータが読み込まれていれば）
        if (report === 'category' && !this.loadingCategory && this.hasChartJS) {
            this.$nextTick(() => {
                this.renderCategoryChart();
            });
        }
    },
    
    loadInventoryStats() {
        variables.axiosAuth().get(variables.API_URL + 'reports/inventory-statistics')
        .then(response => {
            console.log('Inventory statistics:', response.data);
            this.inventoryStats = response.data;
            this.loadingInventory = false;
        })
        .catch(error => {
            console.error('Error loading inventory statistics:', error);
            if (error.response && error.response.status === 401) {
                this.$router.push('/login');
            }
            this.loadingInventory = false;
        });
    },
    
    loadCategoryData() {
        variables.axiosAuth().get(variables.API_URL + 'reports/sales-by-category')
        .then(response => {
            console.log('Category data:', response.data);
            // サブカテゴリの表示フラグを追加
            this.categoryData = response.data.map(cat => ({
                ...cat,
                showSubcategories: false
            }));
            this.loadingCategory = false;
            
            // ChartJS が存在するかどうかを確認
            this.checkChartJS();
            
            // データが読み込まれた後、ChartJSが利用可能ならグラフを描画
            if (this.hasChartJS) {
                this.$nextTick(() => {
                    this.renderCategoryChart();
                });
            }
        })
        .catch(error => {
            console.error('Error loading category data:', error);
            if (error.response && error.response.status === 401) {
                this.$router.push('/login');
            }
            this.loadingCategory = false;
        });
    },
    
    loadValueData() {
        variables.axiosAuth().get(variables.API_URL + 'reports/stock-value')
        .then(response => {
            console.log('Value data:', response.data);
            this.valueData = response.data;
            this.loadingValue = false;
        })
        .catch(error => {
            console.error('Error loading value data:', error);
            if (error.response && error.response.status === 401) {
                this.$router.push('/login');
            }
            this.loadingValue = false;
        });
    },
    
    toggleSubcategories(category) {
        category.showSubcategories = !category.showSubcategories;
    },
    
    checkChartJS() {
        // グローバルスコープでChartが定義されているかどうかを確認
        this.hasChartJS = typeof Chart !== 'undefined';
        
        if (!this.hasChartJS) {
            console.warn('Chart.js is not available. Charts will not be rendered.');
        }
    },
    
    renderCategoryChart() {
        // すでにチャートがあれば破棄
        if (this.categoryChart) {
            this.categoryChart.destroy();
        }
        
        const canvas = document.getElementById('categoryItemCountChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // チャートデータの準備
        const labels = this.categoryData.map(cat => cat.name);
        const data = this.categoryData.map(cat => cat.item_count);
        
        // ランダムな色を生成
        const backgroundColors = this.categoryData.map(() => 
            `rgba(${Math.floor(Math.random() * 200)}, ${Math.floor(Math.random() * 200)}, ${Math.floor(Math.random() * 200)}, 0.6)`
        );
        
        this.categoryChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: '商品数',
                    data: data,
                    backgroundColor: backgroundColors,
                    borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `商品数: ${context.raw}`;
                            }
                        }
                    }
                }
            }
        });
    }
},
mounted() {
    // 最初のレポートのデータを読み込む
    this.loadInventoryStats();
    
    // ChartJSの確認
    this.checkChartJS();
}
}