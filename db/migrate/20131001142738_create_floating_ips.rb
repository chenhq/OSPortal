class CreateFloatingIps < ActiveRecord::Migration
  def change
    create_table :floating_ips do |t|

      t.timestamps
    end
  end
end
