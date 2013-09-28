class CreateOperatingSystems < ActiveRecord::Migration
  def change
    create_table :operating_systems do |t|
      t.string :name
      t.integer :os_type_id
      t.string :cpuarc
      t.integer :cpubit
      t.string :desc

      t.timestamps
    end
  end
end
