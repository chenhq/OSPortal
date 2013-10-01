class CreateSecurities < ActiveRecord::Migration
  def change
    create_table :securities do |t|

      t.timestamps
    end
  end
end
